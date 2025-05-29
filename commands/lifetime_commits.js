const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lifetime_commits')
    .setDescription('Get total commits in Chess_Game by MananKakkar1 and kakkarm2'),

  async execute(interaction) {
    await interaction.deferReply();

    const repoOwner = "csc301-2025-y";
    const repoName = "5-Flymingos-Inc";

    const usernames = [
      "MananKakkar1",
      "FahamGoraya",
      "PrimitiveTechExperience",
      "AnirudhBharadwaj1",
      "Trishul2005",
      "RahulG-0",
      "tusharra0"
    ];

    const authorNames = [
      "Manan Kakkar",
      "kakkarm2",
      "Faham Goraya",
      "PrimitiveTechExperience",
      "Anirudh Bharadwaj",
      "Trishul",
      "Rahul G",
      "Tushar Rao"
    ];

    const perPage = 100;
    let page = 1;
    let totalCommits = 0;
    const userCommitCounts = {};

    usernames.forEach(username => userCommitCounts[username] = 0);

    try {
      while (true) {
        const res = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=${perPage}&page=${page}`, {
          headers: {
            'Authorization': `Bearer ${process.env.GITHUB_PRIVATE_TOKEN}`,
            'User-Agent': 'discord-bot'
          }
        });

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) break;

        for (const commit of data) {
          const login = commit.author?.login;
          const name = commit.commit?.author?.name;

          if (usernames.includes(login)) {
            totalCommits++;
            userCommitCounts[login]++;
          } else if (name && authorNames.includes(name)) {
            // Try to match name to one of the GitHub usernames
            const matched = usernames.find(u => u.toLowerCase().includes(name.toLowerCase()));
            if (matched) {
              totalCommits++;
              userCommitCounts[matched]++;
            }
          }
        }

        if (data.length < perPage) break;
        page++;
      }

      let breakdown = Object.entries(userCommitCounts)
        .map(([user, count]) => `• ${user}: ${count}`)
        .join('\n');

      await interaction.editReply(
        `🔒 **Commits to [${repoName}](https://github.com/${repoOwner}/${repoName})**\n` +
        `• Total Commits: **${totalCommits}**\n` +
        `${breakdown}`
      );
    } catch (error) {
      console.error('❌ REST API error:', error);
      await interaction.editReply('❌ Failed to retrieve commit data. Please ensure the token has access to the private repo.');
    }
  }
};
