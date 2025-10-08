import { CompositeCursor } from '../interfaces/cursor.interface';
import { SelectQueryBuilder } from 'typeorm';

export class CursorUtils {
  static encode(cursor: CompositeCursor): string {
    return Buffer.from(JSON.stringify(cursor)).toString('base64url');
  }

  static decode(cursorString: string): CompositeCursor | null {
    try {
      const decoded = Buffer.from(cursorString, 'base64url').toString('utf-8');
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  static createFromEntity(
    entity: any, 
    sortFields: string[],
    sortOrders: ('ASC' | 'DESC')[] = []
  ): CompositeCursor {
    const values: Record<string, any> = {};
    
    sortFields.forEach(field => {
      values[field] = entity[field];
    });

    return {
      values,
      sortFields,
      sortOrders: sortOrders.length > 0 ? sortOrders : sortFields.map(() => 'ASC'),
      timestamp: Date.now(),
      version: '1.0'
    };
  }

  static buildCursorCondition(
    qb: SelectQueryBuilder<any>,
    cursor: CompositeCursor,
    direction: 'next' | 'prev' = 'next'
  ): SelectQueryBuilder<any> {
    if (!cursor || !cursor.values) return qb;

    const conditions: string[] = [];
    const params: Record<string, any> = {};

    for (let i = 0; i < cursor.sortFields.length; i++) {
      const field = cursor.sortFields[i];
      const value = cursor.values[field];
      const order = cursor.sortOrders[i] || 'ASC';
      const isDesc = order === 'DESC';
      const isNext = direction === 'next';
      
      // Build condition for this field
      let condition: string;
      
      if (i === 0) {
        // Primary field condition
        if (isNext) {
          condition = isDesc 
            ? `${qb.alias}.${field} < :cursor_${field}`
            : `${qb.alias}.${field} > :cursor_${field}`;
        } else {
          condition = isDesc
            ? `${qb.alias}.${field} > :cursor_${field}`
            : `${qb.alias}.${field} < :cursor_${field}`;
        }
      } else {
        // Secondary field conditions (for tie-breaking)
        const prevField = cursor.sortFields[i - 1];
        const prevValue = cursor.values[prevField];
        const prevOrder = cursor.sortOrders[i - 1] || 'ASC';
        const prevIsDesc = prevOrder === 'DESC';
        
        if (isNext) {
          condition = isDesc
            ? `(${qb.alias}.${prevField} = :cursor_${prevField} AND ${qb.alias}.${field} < :cursor_${field})`
            : `(${qb.alias}.${prevField} = :cursor_${prevField} AND ${qb.alias}.${field} > :cursor_${field})`;
        } else {
          condition = isDesc
            ? `(${qb.alias}.${prevField} = :cursor_${prevField} AND ${qb.alias}.${field} > :cursor_${field})`
            : `(${qb.alias}.${prevField} = :cursor_${prevField} AND ${qb.alias}.${field} < :cursor_${field})`;
        }
      }

      conditions.push(condition);
      params[`cursor_${field}`] = value;
    }

    if (conditions.length > 0) {
      qb.andWhere(`(${conditions.join(' OR ')})`, params);
    }

    return qb;
  }
}
