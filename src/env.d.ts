interface ImportMetaEnv {
  readonly CMS_ARTICLES_SOURCE?: 'mock' | 'wordpress' | 'is';
  readonly CMS_PEOPLE_SOURCE?: 'mock' | 'is';
  readonly CMS_PAGES_SOURCE?: 'mock' | 'wordpress' | 'is';
  readonly CMS_PROGRAM_SOURCE?: 'mock' | 'wordpress' | 'is';
  readonly CMS_EVENTS_SOURCE?: 'mock' | 'is';
  readonly IS_API_URL?: string;
  readonly IS_API_TOKEN?: string;
  readonly WP_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
