import usersCsv from '../../data/users.csv?raw';

export interface User {
    username: string;
    role: string;
}

export const parseUsers = (): Map<string, { password: string, role: string }> => {
    const lines = usersCsv.split('\n');
    const users = new Map<string, { password: string, role: string }>();

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [username, password, role] = line.split(',');
        if (username && password && role) {
            users.set(username.trim(), { password: password.trim(), role: role.trim() });
        }
    }
    return users;
};
