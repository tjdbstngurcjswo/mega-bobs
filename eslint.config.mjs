import {dirname} from 'path';
import {fileURLToPath} from 'url';

import {FlatCompat} from '@eslint/eslintrc';

// eslint-disable-next-line @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line @typescript-eslint/naming-convention
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // =============================================
      // 코드 품질 관련 규칙
      // =============================================

      // 사용하지 않는 변수 감지
      'no-unused-vars': 'off', // JavaScript 기본 규칙을 비활성화 (TypeScript에서 더 정확하게 처리)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // _로 시작하는 매개변수는 무시 (예: _req, _res)
          varsIgnorePattern: '^_', // _로 시작하는 변수는 무시 (예: _temp)
          caughtErrorsIgnorePattern: '^_', // catch 문에서 _로 시작하는 에러는 무시
        },
      ],
      'no-console': 'warn', // console.log 사용 시 경고 (프로덕션에서는 제거되어야 함)
      'no-debugger': 'error', // debugger 문 사용 시 에러 (프로덕션에서는 절대 포함되면 안됨)
      'prefer-const': 'error', // 재할당되지 않는 변수는 const 사용 강제
      'no-var': 'error', // var 사용 금지 (let, const 사용 권장)

      // =============================================
      // React 관련 규칙
      // =============================================

      'react/jsx-no-duplicate-props': 'error', // JSX에서 중복된 props 금지
      'react/jsx-no-undef': 'error', // JSX에서 정의되지 않은 컴포넌트 사용 금지
      'react/jsx-uses-react': 'off', // React 17+ 새로운 JSX Transform에서는 불필요
      'react/react-in-jsx-scope': 'off', // React 17+ 새로운 JSX Transform에서는 불필요
      'react/prop-types': 'off', // TypeScript 사용 시 prop-types 불필요
      'react/display-name': 'off', // forwardRef 등에서 displayName 강제하지 않음
      'react/jsx-key': 'error', // 리스트 렌더링 시 key prop 필수
      'react/no-unescaped-entities': 'error', // JSX에서 이스케이프되지 않은 문자 금지 (예: & → &amp;)
      'react-hooks/rules-of-hooks': 'error', // Hook 사용 규칙 강제 (조건문 내부에서 사용 금지 등)
      'react-hooks/exhaustive-deps': 'warn', // useEffect 의존성 배열 검증 (누락된 의존성 경고)

      // =============================================
      // TypeScript 관련 규칙
      // =============================================

      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용 시 경고 (타입 안정성 향상)
      '@typescript-eslint/no-non-null-assertion': 'warn', // ! 연산자 사용 시 경고 (null 체크 권장)

      // =============================================
      // Import/Export 관련 규칙
      // =============================================

      'import/no-duplicates': 'error', // 같은 모듈을 여러 번 import 하는 것 금지
      'import/order': [
        'error',
        {
          // import 순서 정렬: 내장 모듈 → 외부 라이브러리 → 내부 모듈 → 상대 경로
          groups: [
            'builtin', // Node.js 내장 모듈 (fs, path 등)
            'external', // 외부 라이브러리 (react, lodash 등)
            'internal', // 내부 모듈 (@/ 등)
            'parent', // 부모 디렉토리 (../)
            'sibling', // 형제 디렉토리 (./)
            'index', // index 파일
          ],
          'newlines-between': 'always', // 그룹 간 빈 줄 필수
          alphabetize: {
            order: 'asc', // 알파벳 순서로 정렬
            caseInsensitive: true, // 대소문자 구분 안함
          },
        },
      ],

      // =============================================
      // 코드 스타일 관련 규칙 (가독성 중시)
      // =============================================

      'max-lines': ['warn', {max: 300, skipComments: true}], // 파일 최대 300줄 (주석 제외)
      'max-lines-per-function': ['warn', {max: 50, skipComments: true}], // 함수 최대 50줄 (주석 제외)
      complexity: ['warn', 10], // 순환 복잡도 최대 10 (if, for, while 등의 중첩 제한)
      'max-depth': ['warn', 3], // 중첩 블록 최대 3단계 (가독성 향상)
      'max-params': ['warn', 4], // 함수 매개변수 최대 4개 (객체로 전달 권장)
      'prefer-template': 'warn', // 문자열 연결 시 템플릿 리터럴 사용 강제
      'object-shorthand': 'warn', // 객체 축약 표현 사용 강제 ({ name: name } → { name })
      'object-curly-spacing': ['error', 'never'], // 객체 중괄호 안에 공백 없음 ({foo: bar})

      // =============================================
      // Next.js 관련 규칙
      // =============================================

      '@next/next/no-img-element': 'error', // <img> 대신 next/image 사용 강제 (최적화)
      '@next/next/no-page-custom-font': 'error', // 페이지별 폰트 대신 next/font 사용 강제
      '@next/next/no-sync-scripts': 'error', // 동기 스크립트 태그 금지 (성능 최적화)
      '@next/next/no-html-link-for-pages': 'error', // <a> 태그 대신 next/link 사용 강제

      // =============================================
      // 명명 규칙
      // =============================================

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'], // 변수: camelCase, PascalCase, UPPER_CASE
          leadingUnderscore: 'allow', // 언더스코어로 시작하는 변수 허용
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'], // 함수: camelCase, PascalCase (React 컴포넌트는 PascalCase)
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'], // 타입, 인터페이스, 클래스: PascalCase
        },
      ],

      // =============================================
      // 접근성 관련 규칙
      // =============================================

      'jsx-a11y/alt-text': 'error', // 이미지에 alt 속성 필수 (스크린 리더 지원)
      'jsx-a11y/anchor-is-valid': 'error', // 유효한 앵커 태그 사용 강제
      'jsx-a11y/no-static-element-interactions': 'warn', // 정적 요소에 이벤트 핸들러 사용 시 경고
    },
  },
];

export default eslintConfig;
