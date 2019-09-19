import { Device, initFullPageEditorWithAdf, snapshot } from '../_utils';
import { tableSelectors } from '../../__helpers/page-objects/_table';
import { EditorProps } from '../../../types';
import adf from './__fixtures__/table-with-overflown-content.adf.json';

describe('Overflown content', () => {
  let page: any;
  const editorProps: EditorProps = {
    allowTables: {
      allowColumnResizing: true,
    },
  };

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  describe('when content is wider than a cell', () => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(
        page,
        adf,
        Device.LaptopHiDPI,
        undefined,
        editorProps,
      );
    });

    it('should not overflow beyond the cell', async () => {
      await snapshot(page, {}, tableSelectors.tableWrapper);
      const middleCell = 'table > tbody > tr:nth-child(2) > td:nth-child(2)';
      await page.waitForSelector(middleCell);
      await page.click(middleCell);
      await snapshot(page, {}, tableSelectors.tableWrapper);
    });
  });
});
