/**
 * gigs router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::gigs.gigs', {
	config: {
		find: {
			middlewares: ['api::gigs.gigs-populate'],
		},
	},
});

