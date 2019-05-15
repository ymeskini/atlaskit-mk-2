import {
  MediaPickerComponents,
  MediaPickerComponent,
} from '@atlaskit/media-picker';
import { ContextFactory } from '@atlaskit/media-core';
import {
  StoryBookAuthProvider,
  userAuthProvider,
} from '@atlaskit/media-test-helpers';

import PickerFacade, {
  PickerType,
} from '../../../../plugins/media/picker-facade';
import { ErrorReportingHandler } from '@atlaskit/editor-common';

describe('Media PickerFacade', () => {
  const errorReporter: ErrorReportingHandler = {
    captureException: (err: any) => {},
    captureMessage: (msg: any) => {},
  };

  const context = ContextFactory.create({
    authProvider: StoryBookAuthProvider.create(false),
    userAuthProvider,
  });

  const pickerFacadeConfig = {
    context,
    errorReporter,
  };

  // Spies
  const commonSpies: { [S in keyof MediaPickerComponent]: jest.Mock } = {
    addListener: jest.fn(),
    cancel: jest.fn(),
    emit: jest.fn(),
    emitUploadEnd: jest.fn(),
    emitUploadError: jest.fn(),
    emitUploadPreviewUpdate: jest.fn(),
    emitUploadProcessing: jest.fn(),
    emitUploadProgress: jest.fn(),
    emitUploadsStart: jest.fn(),
    off: jest.fn(),
    on: jest.fn(),
    onAny: jest.fn(),
    once: jest.fn(),
    removeAllListeners: jest.fn(),
    removeListener: jest.fn(),
    setUploadParams: jest.fn(),
    teardown: jest.fn(),
  };
  const specificSpies: {
    [K in keyof MediaPickerComponents]: {
      [S in Partial<keyof MediaPickerComponents[K]>]: jest.Mock
    }
  } = {
    browser: {
      ...commonSpies,
      teardown: jest.fn(),
      browse: jest.fn(),
      addFiles: jest.fn(),
    },
    popup: {
      ...commonSpies,
      show: jest.fn(),
      teardown: jest.fn(),
      hide: jest.fn(),
      emitClosed: jest.fn(),
    },
  };

  const pickerTypes: Array<PickerType> = ['popup', 'browser'];

  pickerTypes.forEach(pickerType => {
    describe(`Picker: ${pickerType}`, () => {
      let facade: PickerFacade;
      let spies = (specificSpies as Record<PickerType, any>)[pickerType];

      beforeEach(async () => {
        Object.keys(spies).forEach(k => spies[k].mockClear());

        class MockPopup {
          constructor() {
            (Object.keys(spies) as Array<keyof typeof spies>).forEach(
              k => ((this as any)[k] = spies[k]),
            );
          }
        }

        const MediaPickerMock = jest
          .fn()
          .mockReturnValue(Promise.resolve(new MockPopup()));

        facade = new PickerFacade(
          pickerType,
          pickerFacadeConfig,
          {
            uploadParams: { collection: '' },
          },
          MediaPickerMock,
        );
        await facade.init();
      });

      afterEach(() => {
        facade.destroy();
      });

      it(`listens to picker events`, () => {
        const fn = jasmine.any(Function);
        expect(spies.on).toHaveBeenCalledTimes(4);
        expect(spies.on).toHaveBeenCalledWith('upload-preview-update', fn);
        expect(spies.on).toHaveBeenCalledWith('upload-processing', fn);
      });

      it('removes listeners on destruction', () => {
        facade.destroy();
        expect(spies.removeAllListeners).toHaveBeenCalledTimes(3);
        expect(spies.removeAllListeners).toHaveBeenCalledWith(
          'upload-preview-update',
        );
        expect(spies.removeAllListeners).toHaveBeenCalledWith(
          'upload-processing',
        );
      });

      // Picker Specific Tests
      if (pickerType === 'popup' || pickerType === 'browser') {
        it(`should call picker's teardown() on destruction`, () => {
          facade.destroy();
          expect(spies.teardown).toHaveBeenCalledTimes(1);
        });
      }

      if (pickerType === 'popup') {
        it(`should call picker's show() on destruction`, () => {
          facade.show();
          expect(spies.show).toHaveBeenCalledTimes(1);
        });
      } else if (pickerType === 'browser') {
        it(`should call picker's browse() on destruction`, () => {
          facade.show();
          expect(spies.browse).toHaveBeenCalledTimes(1);
        });
      }

      if (pickerType === 'popup') {
        it(`should call picker's hide() on destruction`, () => {
          facade.hide();
          expect(spies.hide).toHaveBeenCalledTimes(1);
        });
      }

      if (pickerType === 'popup') {
        it(`should call picker on close when onClose is called`, () => {
          spies.on.mockClear();
          const closeCb = jest.fn();
          facade.onClose(closeCb);

          expect(spies.on).toHaveBeenCalledTimes(1);
          expect(spies.on).toHaveBeenCalledWith('closed', closeCb);
        });
      }
    });
  });
});
