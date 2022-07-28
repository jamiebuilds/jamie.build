let repostoryStatsDataFragment = /* GraphQL */`
  fragment RepositoryStatsData on Repository {
    owner {
      login
    }
    name
    forkCount
    stargazerCount
    primaryLanguage {
      name
    }
    description
    url
  }
`

let repositoryStatsQuery = /* GraphQL */`
  ${repostoryStatsDataFragment}
  query RepositoryStats($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name, followRenames: true) {
      ...RepositoryStatsData
    }
  }
`

let repositoriesStatsForOwnerQuery = /* GraphQL */`
  ${repostoryStatsDataFragment}
  query RepositoriesStatsForOwner($owner: String!) {
    repositoryOwner(login: $owner) {
      repositories(
        isFork: false
        privacy: PUBLIC
        first: 100
        orderBy: {field: STARGAZERS, direction: DESC}
        ownerAffiliations: OWNER
      ) {
        nodes {
          ...RepositoryStatsData
        }
      }
    }
  }
`

let OWNERS = [
  "jamiebuilds",
  "babel-utils",
  "projectorjs",
  "boltpkg",
];

let REPOS = [
  { owner: "marionettejs", name: "backbone.marionette" },
  { owner: "marionettejs", name: "backbone.radio" },
  { owner: "babel", name: "babel" },
  { owner: "lerna", name: "lerna" },
  { owner: "cloudflare", name: "cf-ui" },
  { owner: "cloudflare", name: "react-modal2" },
  { owner: "cloudflare", name: "react-gateway" },
  { owner: "cloudflare", name: "a11y-focus-scope" },
  { owner: "cloudflare", name: "a11y-focus-store" },
  { owner: "babel", name: "babili" },
  { owner: "facebook", name: "flow" },
  { owner: "yarnpkg", name: "yarn" },
  { owner: "yarnpkg", name: "website" },
  { owner: "babel", name: "babel.github.io" },
  { owner: "facebook", name: "jest" },
  { owner: "flowtype", name: "flow-inspect" },
  { owner: "styled-components", name: "babel-plugin-polished" },
  { owner: "babel", name: "generator-babel-plugin" },
  { owner: "styled-components", name: "styled-theming" },
  { owner: "thinkmill", name: "react-markings" },
  { owner: "thinkmill", name: "parse-toml-stream" },
  { owner: "thinkmill", name: "jest-in-case" },
  { owner: "atlassian", name: "landkid" },
  { owner: "parcel-bundler", name: "parcel" },
]

async function query(query, variables) {
  let response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("GITHUB_TOKEN")}`
    },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  let json = await response.json()
  return json
}

let repos = []

let promises = []

promises.push(...OWNERS.map(async (owner) => {
  let data = await query(repositoriesStatsForOwnerQuery, { owner })
  repos = repos.concat(data.data.repositoryOwner.repositories.nodes)
}))

promises.push(...REPOS.map(async (repo) => {
  let data = await query(repositoryStatsQuery, { owner: repo.owner, name: repo.name })
  repos.push(data.data.repository)
}))

await Promise.all(promises)

repos = repos.filter(repo => {
  return repo.stargazerCount !== 0 && !repo.name.includes("__")
}).sort((a, b) => {
  return b.stargazerCount - a.stargazerCount
}).map(repo => {
  return {
    owner: repo.owner.login,
    name: repo.name,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    language: repo.primaryLanguage?.name ?? null,
    description: repo.description,
    url: repo.url
  }
})

await Deno.writeTextFile("repos.json", JSON.stringify(repos, null, 2))
