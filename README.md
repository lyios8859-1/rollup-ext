# rollup plugins

# 创建工作流

- .github/workflows/main.yml

  ```yml
  name: Node.js CI

  on:
    push:
      branches:
        - main
        - '[0-9]+.[0-9]+.x'
        - '[0-9]+.x.x'
        - '[0-9]+.x'
        - next
        - next-major
        - alpha
        - beta
    pull_request:
      branches:
        - main
        - '[0-9]+.[0-9]+.x'
        - '[0-9]+.x.x'
        - '[0-9]+.x'
        - next
        - next-major
        - alpha
        - beta

  jobs:
    build:

      runs-on: ubuntu-latest

      strategy:
        matrix:
          node-version: [15.x, 16.x, 17.x]

      steps:
        - uses: actions/checkout@v2
        - name: Use Node.js ${{ matrix.node-version }}
          uses: actions/setup-node@v2
          with:
            node-version: ${{ matrix.node-version }}
        - run: npm install
        - run: npm run lint --workspaces --if-present
        - run: npm run build --workspaces --if-present
        - run: npm run test --workspaces --if-present

    publish:

      needs: build

      runs-on: ubuntu-latest

      steps:
        - uses: actions/checkout@v2
        - name: Use Node.js
          uses: actions/setup-node@v2
          with:
            node-version: '16.x'
            registry-url: 'https://registry.npmjs.org'
            scope: '@timly'
        - run: npm install
        - run: npm run build --workspaces --if-present
        - run: npm run semantic-release --workspaces --if-present
          env:
              NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
              GITHUB_TOKEN: ${{ secrets.GIT_TOKEN }}
  ```

# 获取GITHUB和NPM的TOKEN

- GITHUB生成TOKEN
  - 登录 github，进入个人中心 settings->Developer settings->Personal access tokens->Generate new token 接下来就是选择对应的权限，再 Generate token 既可以，记得复制保存下来。
  - 各自项目仓库包下的 Settings->Actions->Secrets->Actions->New repository secret 接下来就是把个人中心的生成的token复制过来使用
- NPM生成TOKEN
  - 登录 npm，进入个人中心  Access Tokens->Generate New Token 指定名字生成既可，复制下来，github需要，在对应的github 仓库下创建 actions 的工作流中添加对应的 npm 的发布命令，就可以在提交代码后自动发布了。

# 配置工作流

- 根目录下创建 .npmrc

    ```tex
    save-exact:true
    access=public
    ```

- 在 monorepo 管理各自的包中添加 .releaserc

  ```yml
  {
    "branches": [
      "+([0-9])?(.{+([0-9]),x}).x",
      "main",
      "next",
      "next-major",
      {
        "name": "beta",
        "prerelease": true
      },
      {
        "name": "alpha",
        "prerelease": true
      }
    ],
    "extends": [
      "semantic-release-monorepo"
    ],
    "plugins": [
      [
        "@semantic-release/commit-analyzer",
        {
          "preset": "angular",
          "parserOpts": {
            "noteKeywords": [
              "BREAKING CHANGE",
              "BREAKING CHANGES",
              "BREAKING"
            ]
          }
        }
      ],
      [
        "@semantic-release/changelog",
        {
          "changelogFile": "CHANGELOG.md",
          "changelogTitle": "Changelog"
        }
      ],
      "@semantic-release/release-notes-generator",
      [
        "update-monorepo-package-json",
        {
          "prefix": "^"
        }
      ],
      [
        "@semantic-release/npm",
        {
          "npmPublish": true
        }
      ],
      "@semantic-release/git"
    ]

  }
  ```

  ```sh
  yarn add semantic-release

  // 这两个是为了集成 changelog，打 tags，自动更新版本号
  yarn add @semantic-release/changelog @semantic-release/git -D
  ```

[https://img.shields.io/badge/semantic-release-brightgreen](https://www.npmjs.com/package/semantic-release)
