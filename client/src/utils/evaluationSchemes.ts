// import { CourseType } from "../types";

// export interface EvaluationSchemeConfig {
//   weights: { [key: string]: number };
//   totalScore: { [key: string]: number };
// }

// const EVALUATION_SCHEMES: Record<CourseType, EvaluationSchemeConfig> = {
//   PG: {
//     weights: {
//       CA1: 0.4,
//       CA2: 0.4,
//       ASSIGNMENT: 0.2,
//     },
//     totalScore: {
//       CA1: 40,
//       CA2: 40,
//       ASSIGNMENT: 20,
//     },
//   },
//   "PG-Integrated": {
//     weights: {
//       CA1: 0.3,
//       CA2: 0.3,
//       LAB: 0.3,
//       ASSIGNMENT: 0.1,
//     },
//     totalScore: {
//       CA1: 30,
//       CA2: 30,
//       LAB: 30,
//       ASSIGNMENT: 10,
//     },
//   },
//   UG: {
//     weights: {
//       CA1: 0.25,
//       CA2: 0.25,
//       CA3: 0.25,
//       ASSIGNMENT: 0.25,
//     },
//     totalScore: {
//       CA1: 25,
//       CA2: 25,
//       CA3: 25,
//       ASSIGNMENT: 25,
//     },
//   },
//   "UG-Integrated": {
//     weights: {
//       CA1: 0.2,
//       CA2: 0.2,
//       CA3: 0.2,
//       LAB: 0.3,
//       ASSIGNMENT: 0.1,
//     },
//     totalScore: {
//       CA1: 20,
//       CA2: 20,
//       CA3: 20,
//       LAB: 30,
//       ASSIGNMENT: 10,
//     },
//   },
//   "UGPG-Lab-Only": {
//     weights: {
//       CONTINUOUS_EVALUATION: 1.0,
//     },
//     totalScore: {
//       CONTINUOUS_EVALUATION: 100,
//     },
//   },
// };

// export { EVALUATION_SCHEMES };

// import { CourseType } from "../types";

// export interface EvaluationSchemeConfig {
//   weights: { [key: string]: number };
//   totalScore: { [key: string]: number };
// }

// export const EVALUATION_SCHEMES: Record<CourseType, EvaluationSchemeConfig> = {
//   PG: {
//     weights: {
//       CA1: 0.4,
//       CA2: 0.4,
//       ASSIGNMENT: 0.2,
//     },
//     totalScore: {
//       CA1: 40,
//       CA2: 40,
//       ASSIGNMENT: 20,
//     },
//   },
//   "PG-Integrated": {
//     weights: {
//       CA1: 0.3,
//       CA2: 0.3,
//       LAB: 0.3,
//       ASSIGNMENT: 0.1,
//     },
//     totalScore: {
//       CA1: 30,
//       CA2: 30,
//       LAB: 30,
//       ASSIGNMENT: 10,
//     },
//   },
//   UG: {
//     weights: {
//       CA1: 0.25,
//       CA2: 0.25,
//       CA3: 0.25,
//       ASSIGNMENT: 0.25,
//     },
//     totalScore: {
//       CA1: 25,
//       CA2: 25,
//       CA3: 25,
//       ASSIGNMENT: 25,
//     },
//   },
//   "UG-Integrated": {
//     weights: {
//       CA1: 0.2,
//       CA2: 0.2,
//       CA3: 0.2,
//       LAB: 0.3,
//       ASSIGNMENT: 0.1,
//     },
//     totalScore: {
//       CA1: 20,
//       CA2: 20,
//       CA3: 20,
//       LAB: 30,
//       ASSIGNMENT: 10,
//     },
//   },
//   "UG-Lab-Only": {
//     weights: {
//       CONTINUOUS_EVALUATION: 1.0,
//     },
//     totalScore: {
//       CONTINUOUS_EVALUATION: 100,
//     },
//   },
//   "PG-Lab-Only": {
//     weights: {
//       CONTINUOUS_EVALUATION: 1.0,
//     },
//     totalScore: {
//       CONTINUOUS_EVALUATION: 100,
//     },
//   },
// };

import { CourseType } from "../types";

export interface EvaluationSchemeConfig {
  weights: { [key: string]: number };
  totalScore: { [key: string]: number };
  passingCriteria: { [key: string]: number }; // Added passing criteria
}

export const EVALUATION_SCHEMES: Record<CourseType, EvaluationSchemeConfig> = {
  PG: {
    weights: {
      CA1: 0.4,
      CA2: 0.4,
      ASSIGNMENT: 0.2,
    },
    totalScore: {
      CA1: 40,
      CA2: 40,
      ASSIGNMENT: 20,
    },
    passingCriteria: {
      CA1: 0.4, // 40% to pass
      CA2: 0.4, // 40% to pass
      ASSIGNMENT: 0.4, // 40% to pass
    },
  },
  "PG-Integrated": {
    weights: {
      CA1: 0.3,
      CA2: 0.3,
      LAB: 0.3,
      ASSIGNMENT: 0.1,
    },
    totalScore: {
      CA1: 30,
      CA2: 30,
      LAB: 30,
      ASSIGNMENT: 10,
    },
    passingCriteria: {
      CA1: 0.4, // 40% to pass
      CA2: 0.4, // 40% to pass
      LAB: 0.5, // 50% to pass lab component
      ASSIGNMENT: 0.4, // 40% to pass
    },
  },
  UG: {
    weights: {
      CA1: 0.25,
      CA2: 0.25,
      CA3: 0.25,
      ASSIGNMENT: 0.25,
    },
    totalScore: {
      CA1: 25,
      CA2: 25,
      CA3: 25,
      ASSIGNMENT: 25,
    },
    passingCriteria: {
      CA1: 0.4, // 40% to pass
      CA2: 0.4, // 40% to pass
      CA3: 0.4, // 40% to pass
      ASSIGNMENT: 0.4, // 40% to pass
    },
  },
  "UG-Integrated": {
    weights: {
      CA1: 0.2,
      CA2: 0.2,
      CA3: 0.2,
      LAB: 0.3,
      ASSIGNMENT: 0.1,
    },
    totalScore: {
      CA1: 20,
      CA2: 20,
      CA3: 20,
      LAB: 30,
      ASSIGNMENT: 10,
    },
    passingCriteria: {
      CA1: 0.4, // 40% to pass
      CA2: 0.4, // 40% to pass
      CA3: 0.4, // 40% to pass
      LAB: 0.5, // 50% to pass lab component
      ASSIGNMENT: 0.4, // 40% to pass
    },
  },
  "UG-Lab-Only": {
    weights: {
      CONTINUOUS_EVALUATION: 1.0,
    },
    totalScore: {
      CONTINUOUS_EVALUATION: 100,
    },
    passingCriteria: {
      CONTINUOUS_EVALUATION: 0.5, // 50% to pass lab-only course
    },
  },
  "PG-Lab-Only": {
    weights: {
      CONTINUOUS_EVALUATION: 1.0,
    },
    totalScore: {
      CONTINUOUS_EVALUATION: 100,
    },
    passingCriteria: {
      CONTINUOUS_EVALUATION: 0.5, // 50% to pass lab-only course
    },
  },
};
