export const stagesInfo = {
  development: {
    description: `Development builds are created with a fresh new database loading demonstration data.
        Every commit on this branch will be installed, tested, and deployed automatically.
        A DNS and mail catcher are set up for you to test outgoing emails.
        Builds in development branches are not meant to store sensitive data and have a short lifespan of a few days.`,
  },
  production: {
    description: `Installing an empty database and your production environment with backups and mail
        servers. Commits on staging branches will now be built on a duplicate of your
        production database to ease pre-production tests.
        Commits on the production branch will trigger an update of modules that changed version.`,
  },
  staging: {
    description: `Commits start builds with production data.
        Modules that changed version will be updated.
        Outgoing emails are caught to avoid sending test emails to your customers and scheduled actions are deactivated.
        The latest build always stays alive, older ones can get garbage collected after a while.
        The builds are meant to conduct user-acceptance testing of your newly developed features.`,
  },
};
