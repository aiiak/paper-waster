module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testFileExtensions: ['spec.ts'],
    //testRegex: '(/components/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFiles: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '^.+\\.(css|less|scss)$': 'identity-obj-proxy'
    }
};
