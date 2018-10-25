// @flow
const iconIds: Array<string> = [
  'activity',
  'add-circle',
  'add-item',
  'add',
  'addon',
  'app-access',
  'app-switcher',
  'arrow-down-circle',
  'arrow-down',
  'arrow-left-circle',
  'arrow-left',
  'arrow-right-circle',
  'arrow-right',
  'arrow-up-circle',
  'arrow-up',
  'attachment',
  'audio-circle',
  'audio',
  'backlog',
  'billing-filled',
  'billing',
  'bitbucket/branches',
  'bitbucket/builds',
  'bitbucket/clone',
  'bitbucket/commits',
  'bitbucket/compare',
  'bitbucket/forks',
  'bitbucket/output',
  'bitbucket/pipelines',
  'bitbucket/pullrequests',
  'bitbucket/repos',
  'bitbucket/snippets',
  'bitbucket/source',
  'board',
  'book',
  'bullet-list',
  'calendar-filled',
  'calendar',
  'camera-filled',
  'camera-rotate',
  'camera-take-picture',
  'camera',
  'canvas',
  'check-circle-outline',
  'check-circle',
  'check',
  'checkbox-indeterminate',
  'checkbox',
  'chevron-down-circle',
  'chevron-down',
  'chevron-left-circle',
  'chevron-left-large',
  'chevron-left',
  'chevron-right-circle',
  'chevron-right-large',
  'chevron-right',
  'chevron-up-circle',
  'chevron-up',
  'child-issues',
  'code',
  'comment',
  'component',
  'copy',
  'creditcard-filled',
  'creditcard',
  'cross-circle',
  'cross',
  'dashboard',
  'decision',
  'department',
  'detail-view',
  'discover-filled',
  'discover',
  'document-filled',
  'document',
  'documents',
  'download',
  'dropbox',
  'drag-handler',
  'edit-filled',
  'edit',
  'editor/add',
  'editor/addon',
  'editor/advanced',
  'editor/align-center',
  'editor/align-left',
  'editor/align-right',
  'editor/attachment',
  'editor/background-color',
  'editor/bold',
  'editor/bullet-list',
  'editor/close',
  'editor/code',
  'editor/collapse',
  'editor/date',
  'editor/decision',
  'editor/divider',
  'editor/done',
  'editor/edit',
  'editor/emoji',
  'editor/error',
  'editor/expand',
  'editor/feedback',
  'editor/file',
  'editor/help',
  'editor/hint',
  'editor/horizontal-rule',
  'editor/image-border',
  'editor/image-resize',
  'editor/image',
  'editor/indent',
  'editor/info',
  'editor/italic',
  'editor/layout-three-equal',
  'editor/layout-three-with-sidebars',
  'editor/layout-two-equal',
  'editor/layout-two-left-sidebar',
  'editor/layout-two-right-sidebar',
  'editor/link',
  'editor/media-center',
  'editor/media-full-width',
  'editor/media-wide',
  'editor/media-wrap-left',
  'editor/media-wrap-right',
  'editor/mention',
  'editor/more',
  'editor/note',
  'editor/number-list',
  'editor/open',
  'editor/outdent',
  'editor/panel',
  'editor/photo',
  'editor/quote',
  'editor/recent',
  'editor/redo',
  'editor/remove',
  'editor/search',
  'editor/strikethrough',
  'editor/success',
  'editor/settings',
  'editor/table-display-options',
  'editor/table',
  'editor/task',
  'editor/text-color',
  'editor/text-style',
  'editor/underline',
  'editor/undo',
  'editor/unlink',
  'editor/warning',
  'email',
  'emoji-add',
  'emoji',
  'emoji/activity',
  'emoji/atlassian',
  'emoji/custom',
  'emoji/emoji',
  'emoji/flags',
  'emoji/food',
  'emoji/frequent',
  'emoji/keyboard',
  'emoji/nature',
  'emoji/objects',
  'emoji/people',
  'emoji/productivity',
  'emoji/symbols',
  'emoji/travel',
  'error',
  'export',
  'feedback',
  'file',
  'filter',
  'flag-filled',
  'folder-filled',
  'folder',
  'followers',
  'following',
  'googledrive',
  'graph-bar',
  'graph-line',
  'gsuite',
  'highlights',
  'hipchat/audio-only',
  'hipchat/chevron-double-down',
  'hipchat/chevron-double-up',
  'hipchat/chevron-down',
  'hipchat/chevron-up',
  'hipchat/dial-out',
  'hipchat/lobby',
  'hipchat/media-attachment-count',
  'hipchat/outgoing-sound',
  'hipchat/sd-video',
  'home-circle',
  'home-filled',
  'image-border',
  'image-resize',
  'image',
  'info',
  'invite-team',
  'issue-raise',
  'issue',
  'issues',
  'jira/blocker',
  'jira/capture',
  'jira/critical',
  'jira/failed-build-status',
  'jira/labs',
  'jira/major',
  'jira/medium',
  'jira/minor',
  'jira/test-session',
  'jira/trivial',
  'label',
  'lightbulb-filled',
  'lightbulb',
  'like',
  'link-filled',
  'link',
  'list',
  'location',
  'lock-circle',
  'lock-filled',
  'lock',
  'marketplace',
  'media-services/actual-size',
  'media-services/add-comment',
  'media-services/annotate',
  'media-services/arrow',
  'media-services/audio',
  'media-services/blur',
  'media-services/brush',
  'media-services/button-option',
  'media-services/code',
  'media-services/document',
  'media-services/filter',
  'media-services/fit-to-page',
  'media-services/full-screen',
  'media-services/grid',
  'media-services/image',
  'media-services/line-thickness',
  'media-services/line',
  'media-services/no-image',
  'media-services/open-mediaviewer',
  'media-services/oval',
  'media-services/pdf',
  'media-services/preselected',
  'media-services/presentation',
  'media-services/rectangle',
  'media-services/scale-large',
  'media-services/scale-small',
  'media-services/spreadsheet',
  'media-services/text',
  'media-services/unknown',
  'media-services/video',
  'media-services/zip',
  'media-services/zoom-in',
  'media-services/zoom-out',
  'mention',
  'menu',
  'more-vertical',
  'more',
  'notification-all',
  'notification-direct',
  'notification',
  'office-building-filled',
  'office-building',
  'open',
  'overview',
  'page-filled',
  'page',
  'pdf',
  'people-group',
  'people',
  'person-circle',
  'person',
  'portfolio',
  'preferences',
  'presence-active',
  'presence-busy',
  'presence-unavailable',
  'question-circle',
  'question',
  'questions',
  'queues',
  'quote',
  'radio',
  'recent',
  'redo',
  'refresh',
  'roadmap',
  'room-menu',
  'schedule-filled',
  'schedule',
  'screen',
  'search',
  'select-clear',
  'send',
  'settings',
  'share',
  'ship',
  'shortcut',
  'sign-in',
  'sign-out',
  'star-filled',
  'star-large',
  'star-outline',
  'star',
  'subtask',
  'suitcase',
  'switcher',
  'table',
  'task',
  'trash',
  'tray',
  'undo',
  'unlink',
  'unlock-circle',
  'unlock-filled',
  'unlock',
  'upload',
  'user-avatar-circle',
  'vid-audio-muted',
  'vid-audio-on',
  'vid-backward',
  'vid-camera-off',
  'vid-camera-on',
  'vid-connection-circle',
  'vid-forward',
  'vid-full-screen-off',
  'vid-full-screen-on',
  'vid-hang-up',
  'vid-hd-circle',
  'vid-pause',
  'vid-play',
  'vid-raised-hand',
  'vid-share-screen',
  'vid-speaking-circle',
  'vid-volume-full',
  'vid-volume-half',
  'vid-volume-muted',
  'video-circle',
  'video-filled',
  'warning',
  'watch-filled',
  'watch',
  'world-small',
  'world',
].map(id => `ak-icon-${id}`);

export default iconIds;
