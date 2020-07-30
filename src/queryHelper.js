require('dotenv').config()
const apolloFetch = require('apollo-fetch');
const createApolloFetch = apolloFetch.createApolloFetch

const uri = 'https://api.yelp.com/v3/graphql';
const apiKey = process.env.YELP_API_TOKEN

const getQuery = (zipCode) => {
  return `query searchPlace{
  search(term: "pizza", location:"${zipCode}",  radius: 8000, sort_by: "rating", limit: 20) {
    business{
      name
      id
    }
  }
}
`
}
const queryHelper = function (zipCode) {
  const apolloFetch = createApolloFetch({ uri });
  const query = getQuery(zipCode)

  apolloFetch.use(({ request, options }, next) => {
    if (!options.headers) {
      options.headers = {};  // Create the headers object if needed.
    }
    options.headers['authorization'] = `Bearer ${apiKey}`;

    next();
  });

  return apolloFetch({ query })
}
module.exports = queryHelper
