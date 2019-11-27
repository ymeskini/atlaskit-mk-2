export const expandADF = (breakoutMode = 'default') => ({
  version: 1,
  type: 'doc',
  content: [
    {
      type: 'expand',
      attrs: {
        title: '',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi nisl, venenatis eget auctor vitae, venenatis quis lorem. Suspendisse maximus tortor vel dui tincidunt cursus. ',
            },
            {
              type: 'mention',
              attrs: {
                id: '4',
                text: '@Summer',
                accessLevel: '',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'emoji',
              attrs: {
                shortName: ':grinning:',
                id: '1f600',
                text: '😀',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'emoji',
              attrs: {
                shortName: ':avocado:',
                id: '1f951',
                text: '🥑',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'emoji',
              attrs: {
                shortName: ':carrot:',
                id: '1f955',
                text: '🥕',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
          ],
        },
        {
          type: 'table',
          attrs: {
            isNumberColumnEnabled: false,
            layout: 'default',
          },
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'One',
                          marks: [
                            {
                              type: 'strong',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Two',
                          marks: [
                            {
                              type: 'strong',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Three',
                          marks: [
                            {
                              type: 'strong',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: '1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: '3',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: '5',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: '2',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'nestedExpand',
                      attrs: {
                        title: '',
                      },
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'text',
                              text: 'some text',
                            },
                          ],
                        },
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'mention',
                              attrs: {
                                id: '5',
                                text: '@Lorri Tremble',
                                accessLevel: '',
                              },
                            },
                            {
                              type: 'text',
                              text: ' ',
                            },
                          ],
                        },
                        {
                          type: 'paragraph',
                          content: [
                            {
                              type: 'emoji',
                              attrs: {
                                shortName: ':apple:',
                                id: '1f34e',
                                text: '🍎',
                              },
                            },
                            {
                              type: 'text',
                              text: ' ',
                            },
                            {
                              type: 'emoji',
                              attrs: {
                                shortName: ':melon:',
                                id: '1f348',
                                text: '🍈',
                              },
                            },
                            {
                              type: 'text',
                              text: ' ',
                            },
                            {
                              type: 'emoji',
                              attrs: {
                                shortName: ':avocado:',
                                id: '1f951',
                                text: '🥑',
                              },
                            },
                            {
                              type: 'text',
                              text: ' ',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  attrs: {},
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: '6',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'panel',
          attrs: {
            panelType: 'success',
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Panel content',
                },
              ],
            },
          ],
        },
        {
          type: 'codeBlock',
          attrs: {},
          content: [
            {
              type: 'text',
              text: 'const width = 300;',
            },
          ],
        },
        {
          type: 'taskList',
          attrs: {
            localId: '09012845-28c5-4497-a604-e23efb0dfb52',
          },
          content: [
            {
              type: 'taskItem',
              attrs: {
                localId: '4833526b-2f88-456d-80cf-252ece8b32ea',
                state: 'TODO',
              },
              content: [
                {
                  type: 'text',
                  text: 'Action content',
                },
              ],
            },
          ],
        },
        {
          type: 'decisionList',
          attrs: {
            localId: '71b9920d-e981-432c-9b43-5f91c57ad204',
          },
          content: [
            {
              type: 'decisionItem',
              attrs: {
                localId: '5ff9396d-cb3f-4711-b034-89256d06083c',
                state: 'DECIDED',
              },
              content: [
                {
                  type: 'text',
                  text: 'Decision content',
                },
              ],
            },
          ],
        },
      ],
      marks: [
        {
          type: 'breakout',
          attrs: {
            mode: breakoutMode,
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'paragraph',
      content: [],
    },
    {
      type: 'paragraph',
      content: [],
    },
  ],
});