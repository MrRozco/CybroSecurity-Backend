/**
 * crew router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::crew.crew', {
	config: {
		find: {
			middlewares: ['api::crew.crew-populate'],
		},
	},
});
