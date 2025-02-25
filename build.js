import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';

const CONTENT_PATH = './content.json';
const TEST_CONTENT_PATH = './test-content.json';
const OUTPUT_DIR = './dist';
const TEMPLATE_PATH = './template.html';

async function generateSite(contentPath) {
	await fs.mkdir(OUTPUT_DIR, { recursive: true });
	const template = await fs.readFile(TEMPLATE_PATH, 'utf-8');
	const content = JSON.parse(await fs.readFile(contentPath, 'utf-8'));

	let links = '<nav>';
	links += content.links.map(entry => `
			<div class="button-wrapper">
				<a ${entry.link ? 'href="' + entry.link + '" target="_blank" rel="noopener"' : ''} class="link-button" id="${entry.id}">${entry.content}</a>
			</div>`).join('\n');
	links += `
		</nav>`;

	const outputHTML = template.replace('<!-- LINKS -->', links);
	await fs.writeFile(path.join(OUTPUT_DIR, 'index.html'), outputHTML);
	console.log('Site generated successfully!');
}

// Watch mode
if (process.argv.includes('--watch')) {
	console.log('Watching for changes...');
	chokidar.watch([CONTENT_PATH, TEMPLATE_PATH]).on('all', (event, path) => {
		console.log(`Change detected (${event}): ${path}`);
		generateSite(CONTENT_PATH);
	});
}
if (process.argv.includes('--test')) {
	generateSite(TEST_CONTENT_PATH);
} else {
	generateSite(CONTENT_PATH);
}