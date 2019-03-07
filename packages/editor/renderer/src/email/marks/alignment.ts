import { createTag, serializeStyle } from '../util';
import { MarkSerializerOpts } from '../interfaces';
import { AlignmentAttributes } from '@atlaskit/adf-schema';

export const emailAlignmentsMap: { [key: string]: string } = {
  end: 'right',
  right: 'right',
  center: 'center',
};

const css = (alignment: AlignmentAttributes) =>
  serializeStyle({
    width: '100%',
    'text-align': emailAlignmentsMap[alignment],
  });

export default function alignment({ mark, text }: MarkSerializerOpts) {
  return createTag('div', { style: css(mark.attrs.align) }, text);
}
