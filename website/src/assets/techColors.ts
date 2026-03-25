export const techColors: Record<string, string> = {
    // JS ecosystem
    'JavaScript': 'bg-yellow-700/40 text-yellow-100',
    'Javascript': 'bg-yellow-700/40 text-yellow-100',
    'TypeScript': 'bg-blue-700/40 text-blue-100',
    'Typescript': 'bg-blue-700/40 text-blue-100',
    'Node.js': 'bg-green-700/40 text-green-100',
    'React': 'bg-cyan-700/40 text-cyan-100',
    'Next.js': 'bg-violet-600/40 text-violet-100',
    'jQuery': 'bg-blue-600/40 text-blue-100',
    'Alpine.js': 'bg-teal-600/40 text-teal-100',
    // Styling
    'Tailwind': 'bg-sky-700/40 text-sky-100',
    'Bootstrap': 'bg-purple-700/40 text-purple-100',
    'HTML': 'bg-orange-600/40 text-orange-100',
    'CSS': 'bg-blue-500/40 text-blue-100',
    // Languages
    'Python': 'bg-yellow-600/40 text-yellow-100',
    'Java': 'bg-red-700/40 text-red-100',
    'C#': 'bg-violet-700/40 text-violet-100',
    'SwiftUI': 'bg-orange-600/40 text-orange-100',
    'PHP': 'bg-indigo-700/40 text-indigo-100',
    // .NET
    'Asp.NET': 'bg-purple-600/40 text-purple-100',
    // Data
    'PostgreSQL': 'bg-blue-700/40 text-blue-100',
    'MySQL': 'bg-amber-700/40 text-amber-100',
    'SQL': 'bg-amber-600/40 text-amber-100',
    'SQL Server': 'bg-red-600/40 text-red-100',
    'MongoDB': 'bg-green-700/40 text-green-100',
    'Prisma': 'bg-teal-700/40 text-teal-100',
    'Flask': 'bg-rose-700/40 text-rose-100',
    // Build / tools
    'Gradle': 'bg-teal-600/40 text-teal-100',
    'Git': 'bg-orange-700/40 text-orange-100',
    'Jenkins': 'bg-red-600/40 text-red-100',
    'IntelliJ': 'bg-pink-600/40 text-pink-100',
    'Selenium': 'bg-green-600/40 text-green-100',
    'JUnit': 'bg-emerald-600/40 text-emerald-100',
    // Platforms / services
    'Vercel': 'bg-fuchsia-700/40 text-fuchsia-100',
    'Auth0': 'bg-orange-700/40 text-orange-100',
    'iOS': 'bg-blue-600/40 text-blue-100',
    'Raspberry Pi': 'bg-pink-700/40 text-pink-100',
    'Home Assistant': 'bg-sky-600/40 text-sky-100',
    // APIs
    'OpenAI API': 'bg-emerald-700/40 text-emerald-100',
    'Spotify API': 'bg-green-600/40 text-green-100',
    'Mapbox': 'bg-indigo-600/40 text-indigo-100',
    'Minecraft Forge': 'bg-lime-700/40 text-lime-100',
    // Education
    'Scratch': 'bg-amber-600/40 text-amber-100',
    'APCSA': 'bg-cyan-600/40 text-cyan-100',
};

export function getTechColor(tech: string): string {
    return techColors[tech] || 'bg-purple-700/40 text-purple-100';
}
