jest.mock('@atlaskit/media-store');
import { MediaStore } from '@atlaskit/media-store';
import { ContextFactory } from '@atlaskit/media-core';
import { mockStore, mockFetcher } from '../../../mocks';
import { sendUploadEvent } from '../../../actions/sendUploadEvent';
import finalizeUploadMiddleware, { finalizeUpload } from '../../finalizeUpload';
import {
  FinalizeUploadAction,
  FINALIZE_UPLOAD,
} from '../../../actions/finalizeUpload';
import { State } from '../../../domain';

describe('finalizeUploadMiddleware', () => {
  const auth = {
    clientId: 'some-client-id',
    token: 'some-token',
  };
  const upfrontId = Promise.resolve('1');
  const file = {
    id: 'some-file-id',
    name: 'some-file-name',
    type: 'some-file-type',
    creationDate: Date.now(),
    size: 12345,
    upfrontId,
  };
  const copiedFile = {
    ...file,
    id: 'some-copied-file-id',
  };
  const collection = 'some-collection';
  const uploadId = 'some-upload-id';
  const source = {
    id: file.id,
    collection,
  };
  const setup = (state: Partial<State> = {}) => {
    const store = mockStore(state);
    const { userContext } = store.getState();
    (userContext.config.authProvider as jest.Mock<any>).mockReturnValue(
      Promise.resolve(auth),
    );

    const fetcher = mockFetcher();
    (MediaStore as any).mockImplementation(() => ({
      copyFileWithToken: () => Promise.resolve({ data: copiedFile }),
    }));
    fetcher.pollFile.mockImplementation(() => Promise.resolve(copiedFile));

    return {
      fetcher,
      store,
      next: jest.fn(),
      action: {
        type: FINALIZE_UPLOAD,
        file,
        uploadId,
        source,
      } as FinalizeUploadAction,
    };
  };

  it('should do nothing given unknown action', () => {
    const { fetcher, store, next } = setup();
    const action = {
      type: 'UNKNOWN',
    };

    finalizeUploadMiddleware(fetcher)(store)(next)(action);

    expect(store.dispatch).not.toBeCalled();
    expect(next).toBeCalledWith(action);
  });

  it('should send upload end event with metadata', () => {
    const { fetcher, store, action } = setup();

    return finalizeUpload(fetcher, store, action).then(action => {
      expect(action).toEqual(
        sendUploadEvent({
          event: {
            name: 'upload-end',
            data: {
              file: {
                ...file,
                publicId: copiedFile.id,
              },
              public: copiedFile,
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should send upload processing event with metadata', () => {
    const { fetcher, store, action } = setup();

    return finalizeUpload(fetcher, store, action).then(() => {
      expect(store.dispatch).toBeCalledWith(
        sendUploadEvent({
          event: {
            name: 'upload-processing',
            data: {
              file: {
                ...file,
                publicId: copiedFile.id,
              },
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should send upload error event given some error happens', () => {
    const { fetcher, store, action } = setup();
    const error = {
      message: 'some-error-message',
    };

    (MediaStore as any).mockImplementation(() => ({
      copyFileWithToken: () => Promise.reject(error),
    }));

    return finalizeUpload(fetcher, store, action).then(() => {
      expect(store.dispatch).toBeCalledWith(
        sendUploadEvent({
          event: {
            name: 'upload-error',
            data: {
              file,
              error: {
                name: 'object_create_fail',
                description: error.message,
              },
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('Should resolve deferred id when the source id is on the store', () => {
    const resolver = jest.fn();
    const rejecter = jest.fn();
    const { fetcher, store, action } = setup({
      deferredIdUpfronts: {
        'some-file-id': {
          resolver,
          rejecter,
        },
      },
    });

    return finalizeUpload(fetcher, store, action).then(() => {
      expect(resolver).toHaveBeenCalledTimes(1);
      expect(resolver).toBeCalledWith('some-copied-file-id');
    });
  });

  it('should call copyFileWithToken with the right params', async () => {
    const tenantContext = ContextFactory.create({
      authProvider: jest.fn().mockImplementation(() => Promise.resolve({})),
    });
    const { fetcher, store, action } = setup({
      config: { uploadParams: { collection: 'some-tenant-collection' } },
      tenantContext,
    });
    const copyFileWithToken = jest
      .fn()
      .mockReturnValue(Promise.resolve({ data: { id: 'some-id' } }));

    (MediaStore as any).mockImplementation(() => ({
      copyFileWithToken,
    }));

    await finalizeUpload(fetcher, store, action);

    expect(copyFileWithToken).toBeCalledTimes(1);
    expect(copyFileWithToken).toBeCalledWith(
      {
        sourceFile: {
          collection: 'some-collection',
          id: 'some-file-id',
          owner: {
            clientId: 'some-client-id',
            token: 'some-token',
          },
        },
      },
      {
        collection: 'some-tenant-collection',
        occurrenceKey: undefined,
        replaceFileId: undefined,
      },
    );
    expect(tenantContext.config.authProvider).toBeCalledWith({
      collectionName: 'some-tenant-collection',
    });
  });
});
