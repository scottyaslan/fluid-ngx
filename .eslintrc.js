/*
 * (c) 2018-2020 Cloudera, Inc. All rights reserved.
 *
 *  This code is provided to you pursuant to your written agreement with Cloudera, which may be the terms of the
 *  Affero General Public License version 3 (AGPLv3), or pursuant to a written agreement with a third party authorized
 *  to distribute this code.  If you do not have a written agreement with Cloudera or with an authorized and
 *  properly licensed third party, you do not have any rights to this code.
 *
 *  If this code is provided to you under the terms of the AGPLv3:
 *   (A) CLOUDERA PROVIDES THIS CODE TO YOU WITHOUT WARRANTIES OF ANY KIND;
 *   (B) CLOUDERA DISCLAIMS ANY AND ALL EXPRESS AND IMPLIED WARRANTIES WITH RESPECT TO THIS CODE, INCLUDING BUT NOT
 *       LIMITED TO IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE;
 *   (C) CLOUDERA IS NOT LIABLE TO YOU, AND WILL NOT DEFEND, INDEMNIFY, OR HOLD YOU HARMLESS FOR ANY CLAIMS ARISING
 *       FROM OR RELATED TO THE CODE; AND
 *   (D) WITH RESPECT TO YOUR EXERCISE OF ANY RIGHTS GRANTED TO YOU FOR THE CODE, CLOUDERA IS NOT LIABLE FOR ANY
 *       DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE OR CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED
 *       TO, DAMAGES RELATED TO LOST REVENUE, LOST PROFITS, LOSS OF INCOME, LOSS OF BUSINESS ADVANTAGE OR
 *       UNAVAILABILITY, OR LOSS OR CORRUPTION OF DATA.
 */

const OFF = 0;      // turn the rule off
const WARNING = 1;  // turn the rule on as a warning (doesn’t affect exit code)
const ERROR = 2;    // turn the rule on as an error (exit code is 1 when triggered)

module.exports = {
    "extends": "eslint-config-airbnb-base",
    "env": {
        "browser": true,
        "es6": true,
        "jasmine": true
    },
    "parserOptions": {
        "ecmaVersion": 2017,
        "sourceType": "module"
    },
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "jasmine",
        "@typescript-eslint"
    ],
    overrides: [
        {
            // Legacy Javascript files
            files: ['*.js'],
            rules: {
                "dot-notation": OFF,
                "prefer-arrow-callback": OFF,
                "no-var": OFF,
                "no-redeclare": OFF,
                "no-shadow": OFF,
                "quote-props": OFF,
                "object-shorthand": OFF,
                "vars-on-top": OFF,
                "no-param-reassign": OFF,
                "block-scoped-var": OFF,
                "prefer-destructuring": OFF,
                "prefer-template": OFF,
                "consistent-return": OFF,
                "no-restricted-properties": OFF,
                "no-use-before-define": OFF,
                "object-curly-spacing": OFF,
                "newline-per-chained-call": OFF,
                "no-bitwise": OFF,
                "no-nested-ternary": OFF,
                "no-useless-escape": OFF,
                "no-prototype-builtins": OFF,
                "arrow-body-style": OFF,
                "no-else-return": OFF
            }
        },
        {
            // Typescript files
            files: ['*.ts'],
            rules: {
                "dot-notation": OFF,
                '@typescript-eslint/no-unused-vars': [ERROR, { args: "none" }]
            }
        },
        {
            // Test files
            files: ['*.spec.ts'],
            rules: {
                "max-classes-per-file": OFF
            }
        }
    ],
    "rules": {
        // Customize for all files
        "no-unused-vars": [ERROR, { "no-unused-variable": true }],
        "lines-between-class-members": [ERROR, "always", { "exceptAfterSingleLine": true }],
        "indent": [ERROR, 4, { "SwitchCase": 1 }],
        "jasmine/no-focused-tests": ERROR,
        "class-methods-use-this": OFF,
        "prefer-destructuring": [ERROR, {
            "VariableDeclarator": {
                "array": false,
                "object": true
            },
            "AssignmentExpression": {
                "array": false,
                "object": false
            }
        }],

        // Disable for all files
        "max-len": OFF,
        "func-names": OFF,
        "spaced-comment": OFF,
        "comma-dangle": OFF,
        "import/extensions": OFF,
        "import/no-unresolved": OFF,
        "import/no-extraneous-dependencies": OFF,
        "no-plusplus": OFF,
        "react/no-this-in-sfc": OFF,
        "prefer-promise-reject-errors": OFF,
        "object-curly-newline": OFF,
        "no-restricted-globals": OFF,
        "import/prefer-default-export": OFF,
        "linebreak-style": OFF,
        "quotes": [ERROR, "single", { "allowTemplateLiterals": true }],
        "no-useless-constructor": OFF,
        "no-empty-function": OFF
    },
};
