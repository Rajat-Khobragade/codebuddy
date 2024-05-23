import { Injectable, BadRequestException } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const { expression } = calcBody;
    try {
      const cleanedExpression = expression.replace(/\s+/g, '');
      const tokens = cleanedExpression.match(/(\d+|\+|\-|\*|\/)/g);

      if (tokens.length % 2 === 0) {
        throw new BadRequestException('Invalid expression provided');
      }

      let result = this.evaluateExpression(tokens);

      return  result ;

    } catch (error) {
      throw new BadRequestException(error.message || 'Invalid expression provided');
    }
  }

  private evaluateExpression(tokens: string[]): number {
    let stack: any[] = [];
    let i = 0;
    while (i < tokens.length) {
      if (tokens[i] === '*' || tokens[i] === '/') {

        const operator = tokens[i];
        const prev = parseFloat(stack.pop());
        const next = parseFloat(tokens[++i]);

        if (operator === '*') {
          stack.push(prev * next);
        } else {
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
      if (operator === '+') {
        result += next;
      } else {
        result -= next;
      }
    }
    return result;
  }
}

