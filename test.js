require('dotenv').config();
const fetch = require('node-fetch');

const query = `
query {
  user(login: "MananKakkar1") {
    contributionsCollection(from: "2024-06-01T00:00:00Z", to: "2025-05-29T23:59:59Z") {
      commitContributionsByRepository {
        repository {
          nameWithOwner
        }
        contributions {
          totalCount
        }
      }
      pullRequestContributions {
        totalCount
      }
      issueContributions {
        totalCount
      }
      pullRequestReviewContributions {
        totalCount
      }
    }
  }
}`;

fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
  },
  body: JSON.stringify({ query })
})
  .then(res => res.json())
  .then(data => {
    const collection = data.data.user.contributionsCollection;
    
    const commits = collection.commitContributionsByRepository.reduce((sum, repo) => {
      return sum + repo.contributions.totalCount;
    }, 0);

    const prs = collection.pullRequestContributions.totalCount;
    const issues = collection.issueContributions.totalCount;
    const reviews = collection.pullRequestReviewContributions.totalCount;

    const total = commits + prs + issues + reviews;

    console.log(`Total Contributions: ${total}`);
    console.log(`- Commits: ${commits}`);
    console.log(`- PRs: ${prs}`);
    console.log(`- Issues: ${issues}`);
    console.log(`- Reviews: ${reviews}`);
  })
  .catch(err => console.error('Fetch error:', err));
