require('dotenv').config()
const apolloFetch = require('apollo-fetch');
const createApolloFetch = apolloFetch.createApolloFetch

const uri = 'https://api.yelp.com/v3/graphql';
const apiKey = process.env.YELP_API_TOKEN

const getQuery = (id) => {
  return `query detailedPage{
    business(id: "${id}"){
      name,
      url,
      phone,
      rating,
      location{
        address1,
        city,
        state,
        postal_code,
        country
      },
      price
    }
  }
`
}
const detailedRestaurantQueryHelper = function (id) {
  const apolloFetch = createApolloFetch({ uri });
  const query = getQuery(id)

  apolloFetch.use(({ request, options }, next) => {
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['authorization'] = `Bearer ${apiKey}`;

    next();
  });

  return apolloFetch({ query })
}
module.exports = detailedRestaurantQueryHelper
