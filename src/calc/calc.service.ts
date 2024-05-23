// import { Injectable } from '@nestjs/common';
// import { CalcDto } from './calc.dto';

// @Injectable()
// export class CalcService {
//   calculateExpression(calcBody: CalcDto) {
//     const { expression } = calcBody;

//     try {
//       if (!this.isValidExpression(expression)) {
//         throw new Error('Invalid expression');
//       }

//       const tokens = expression.match(/(\d+|\+|\-|\*|\/)/g);
//       console.log(tokens,'😂😂😂😂😂😂')
//       if (!tokens || tokens.length % 2 === 0) {
//         console.log("Invalid")
//         throw new Error('Invalid expression');
//       }
//       // console.log(tokens,'🤣🤣🤣🤣😎')

//       let result = parseFloat(tokens[0]);
//       for (let i = 1; i < tokens.length; i += 2) {
//         const operator = tokens[i];
//         // console.log(operator,'😍😍')
//         const value = parseFloat(tokens[i + 1]);
//         // console.log(value,"value")
//         if (isNaN(value)) {
//           throw new Error('Invalid number');
//         }

//         switch (operator) {
//           case '+':
//             result = result + value;
//             break;
//           case '-':
//             result = result - value;
//             break;
//           case '*':
//             // console.log("caseee")
//             // console.log(result,"resultresult")
//             // console.log(value,"valuevalue")
//             // result *= value;
//             result = result * value
//             break;
//           case '/':
//             if (value === 0) {
//               throw new Error('Division by zero');
//             }
//             // result /= value;
//             result = result / value;
//             break;
//           default:
//             throw new Error('Invalid operator');
//         }
//       }
//     //  console.log(result,"try")
//       // return  {result} ;
//       return  result;

//     } catch (error) {
//     //  console.log("catch")

//       return {
//         statusCode: 400,
//         message: 'Invalid expression provided',
//         error: 'Bad Request'
//       };
//     }
//   }

//   private isValidExpression(expression: string): boolean {
//     const validCharacters = /^[0-9+\-*/\s]+$/;
//     return validCharacters.test(expression);
//   }
// }



import { Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const { expression } = calcBody;
    try {
      if (!this.isValidExpression(expression)) {
        return {
          statusCode: 400,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        };
      }

      const cleanedExpression = expression.replace(/\s+/g, '');
      const tokens = cleanedExpression.match(/(\d+|\+|\-|\*|\/)/g);
      if (!tokens || tokens.length % 2 === 0 || this.hasTrailingOperator(cleanedExpression)) {
        return {
          statusCode: 400,
          message: 'Invalid expression provided',
          error: 'Bad Request',
        };
      }

      let result = this.evaluateExpression(tokens);

      return result
      

    } catch (error) {
      return {
        statusCode: 400,
        message: error.message || 'Invalid expression provided',
        error: 'Bad Request'
      };
    }
  }

  private isValidExpression(expression: string): boolean {
    const validCharacters = /^[0-9+\-*/\s]+$/;
    return validCharacters.test(expression);
  }

  private hasTrailingOperator(expression: string): boolean {
    return /[+\-*/]\s*$/.test(expression);
  }

  private evaluateExpression(tokens: string[]): number {
    let stack: any[] = [];
    let i = 0;
    while (i < tokens.length) {
      if (tokens[i] === '*' || tokens[i] === '/') {
        const operator = tokens[i];
        const prev = parseFloat(stack.pop());
        const next = parseFloat(tokens[++i]);
        if (isNaN(next)) {
          throw new Error('Invalid number');
        }
        if (operator === '*') {
          stack.push(prev * next);
        } else {
          if (next === 0) {
            throw new Error('Division by zero');
          }
          stack.push(prev / next);
        }
      } else {
        stack.push(tokens[i]);
      }
      i++;
    }

    let result = parseFloat(stack[0]);
    for (i = 1; i < stack.length; i += 2) {
      const operator = stack[i];
      const next = parseFloat(stack[i + 1]);
      if (isNaN(next)) {
        throw new Error('Invalid number');
      }
      if (operator === '+') {
        result += next;
      } else {
        result -= next;
      }
    }
    return result;
  }
}
