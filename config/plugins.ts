export default ({ env }) => ({
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                s3Options: {
                    accessKeyId:"AKIAQOX6E4UHGN7MWOHB",
                    secretAccessKey:"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",
                    region:"us-west-1",
                    params: {
                        Bucket:"ecomerce-strapi-game-irvin",
                    },
                }
            },
        },
    }
  });


