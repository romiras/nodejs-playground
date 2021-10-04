module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    extends: [
        'eslint:recommended',
        'prettier',
        'plugin:@typescript-eslint/recommended',
        'plugin:node/recommended',
        'plugin:prettier/recommended' // make sure this is the last in the list
    ],
    rules: {
        'node/no-unsupported-features/es-syntax': 'off',
        'node/no-missing-import': [
            'error',
            {
                tryExtensions: ['.ts', '.d.ts', '.js', '.node', '.json']
            }
        ],
        '@typescript-eslint/no-var-requires': 'off',
        'no-process-exit': 'off',
        'node/no-unsupported-features/es-builtins': 'off',
        '@typescript-eslint/no-empty-function': 'warn',
        'node/no-extraneous-import': 'off',
        '@typescript-eslint/explicit-module-boundary-types': [
            'warn',
            {
                allowHigherOrderFunctions: true
            }
        ],
        'node/no-unpublished-require': 'off'
    }
}
