import Parser from 'rss-parser';

const parser = new Parser();

async function testFetch() {
  try {
    const feed = await parser.parseURL('https://www.livemint.com/rss/markets');
    console.log('Successfully fetched feed');
    console.log('First item title:', feed.items[0].title);
  } catch (error) {
    console.error('Failed to fetch feed:', error);
  }
}

testFetch();
