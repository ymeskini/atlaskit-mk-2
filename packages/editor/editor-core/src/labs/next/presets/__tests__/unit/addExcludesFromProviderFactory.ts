import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { addExcludesFromProviderFactory } from '../../utils';

describe('addExcludesFromProviderFactory', () => {
  let providerFactory: ProviderFactory;
  let excludes: Set<string>;

  beforeEach(() => {
    providerFactory = new ProviderFactory();
    excludes = new Set<string>();
  });

  describe.each`
    pluginName            | providerName
    ${'mention'}          | ${'mentionProvider'}
    ${'emoji'}            | ${'emojiProvider'}
    ${'macro'}            | ${'macroProvider'}
    ${'customAutoformat'} | ${'autoformattingProvider'}
  `('$pluginName plugin', ({ pluginName, providerName }) => {
    describe(`with ${providerName}`, () => {
      beforeEach(() => {
        providerFactory.setProvider(providerName, Promise.resolve({}));
      });

      test(`should not add ${pluginName} plugin to excludes`, () => {
        addExcludesFromProviderFactory(providerFactory, excludes);
        expect(excludes).not.toContain(pluginName);
      });
    });

    describe(`without ${providerName}`, () => {
      test(`should add ${pluginName} plugin to excludes`, () => {
        addExcludesFromProviderFactory(providerFactory, excludes);
        expect(excludes).toContain(pluginName);
      });
    });

    describe(`excludes contain ${pluginName} plugin`, () => {
      describe(`with ${providerName} provider`, () => {
        beforeEach(() => {
          providerFactory.setProvider(providerName, Promise.resolve({}));
        });

        test(`should keep ${pluginName} plugin into excludes`, () => {
          addExcludesFromProviderFactory(providerFactory, excludes);
          expect(excludes).not.toContain(pluginName);
        });
      });

      describe(`without ${providerName}`, () => {
        test(`should keep ${pluginName} plugin into excludes`, () => {
          addExcludesFromProviderFactory(providerFactory, excludes);
          expect(excludes).toContain(pluginName);
        });
      });
    });
  });
});
