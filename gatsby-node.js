/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']} // TypeScript가 아닌 환경에서도 VSCode 같은 에디터에서 타입 자동완성을 도와주기위한 부분
 */
// 원본
// exports.createPages = async ({ actions }) => {
//   const { createPage } = actions
//   createPage({
//     path: "/using-dsg",
//     component: require.resolve("./src/templates/using-dsg.js"),
//     context: {},
//     defer: true,
//   })
// }

// const path = require('path');

// exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
//   const output = getConfig().output || {};

//   actions.setWebpackConfig({
//     output,
//     resolve: {
//       alias: {
//         components: path.resolve(__dirname, 'src/components'),
//         utils: path.resolve(__dirname, 'src/utils'),
//         hooks: path.resolve(__dirname, 'src/hooks'),
//       },
//     },
//   });
// };

// 수정
// 1. defer: true의 경우 Gatsby Cloud에서만 지원되는데 해당 프로젝트의 경우 gatsby-plugin-gatsby-cloud 패키지를 삭제한 상황이어서 DSG 기능을 사용하지 않는다.
//    향후 Cloud와 로컬 빌드 모두 고려하여 환경 변수에 따라 처리하기 위해 다음과 같이 명시시
const isGatsbyCloud = process.env.GATSBY_CLOUD === 'true';
const fs = require('fs');
const path = require('path');

// 1. createPages 함수 비동기 에러 핸들링
//    만약 페이지 생성 중 에러가 발생하면 프로세스가 중단될 수 있어서, try...catch로 감싸기
exports.createPages = async ({ actions, reporter }) => {
  const { createPage } = actions;

  const templatePath = path.resolve('./src/templates/using-dsg.js'); // 기본 코드를 손대지 않는 범위 내에서 배포 시 오류가 발생하는 부분 처리리

  // 파일이 존재하는지 먼저 확인
  if (fs.existsSync(templatePath)) {
    try {
      createPage({
        path: "/using-dsg",
        component: templatePath,
        context: {},
        defer: isGatsbyCloud, // isGatsbyCloud가 정의되어 있어야 합니다.
      });
    } catch (error) {
      reporter.panicOnBuild(`Error while creating pages:`, error);
    }
  } else {
    reporter.warn(`Template file not found at ${templatePath}. Skipping page creation.`);
  }
};

// 2. getConfig()로 가져온 output은 생략 가능
//    output은 setWebpackConfig에서 대부분의 경우 자동으로 병합되므로, 굳이 명시적으로 전달할 필요 X
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        utils: path.resolve(__dirname, 'src/utils'),
        hooks: path.resolve(__dirname, 'src/hooks'),
      },
    },
  });
};