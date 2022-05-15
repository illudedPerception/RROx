import '../../../types';
import { NameRef } from '../struct';

export abstract class IQuery<T extends object> {
    // Property such that no other types of objects are assignable to this type.
    private __QUERY__?: T;
}

export abstract class IQueryProperty {
    // Property such that no other types of objects are assignable to this type.
    private __QUERY_PROPERTY__?: symbol;
};

/**
 * The Array Query Builder allows you to specify what elements in an array you want to retrieve in the query.
 */
export type QueryBuilderArray<T extends any[]> = {
    /**
     * Retrieves all elements in the array.
     */
    all(): QueryBuilderProperty<T[ number ]>;

    /**
     * Retrieves the first item in the array.
     * Alias for `getIndex( 0 )`
     */
    first(): QueryBuilderProperty<T[ number ]>;

    /**
     * Retrieves the last item in the array.
     * Alias for `getIndex( -1 )`
     */
    last(): QueryBuilderProperty<T[ number ]>;

    /**
     * Retrieves a specific index from the array.
     * Negative indexes are supported: -1 will fetch last element in the array, -2 second to last, etc.
     * 
     * @param index
     */
    index( index: number ): QueryBuilderProperty<T[ number ]>;

    /**
     * Gets a range of indices from the array.
     * Negative indexes are supported: -1 corresponds to the last element in the array, -2 second to last, etc.
     * 
     * @param start Start index (inclusive)
     * @param end End index (inclusive)
     */
    range( start: number, end: number ): QueryBuilderProperty<T[ number ]>;

    /**
     * Retrieves specific indices from the array.
     * Negative indexes are supported: -1 will fetch last element in the array, -2 second to last, etc.
     * 
     * @param indices
     */
    indices( indices: number[] ): QueryBuilderProperty<T[ number ]>;

    /**
     * Gets ranges of indices from the array.
     * Negative indexes are supported: -1 corresponds to the last element in the array, -2 second to last, etc.
     * 
     * @param ranges Array consisting of the ranges of indices to fetch (start and end are inclusive)
     */
    ranges( ranges: [ start: number, end: number ][] ): QueryBuilderProperty<T[ number ]>;
};

/**
 * @ignore
 */
type Without<T, V, WithNevers = {
    [K in keyof T]: Exclude<T[K], undefined> extends V ? never 
    : (T[K] extends Record<string, unknown> ? Without<T[K], V> : T[K])
  }> = Pick<WithNevers, {
    [K in keyof WithNevers]: WithNevers[K] extends never ? never : K
  }[keyof WithNevers]>;

/**
 * The Query Builder allows you to declare which properties you would like to retrieve in the query
 */
export type QueryBuilder<T extends object> = {
    [ K in keyof Without<T, Function> ]: QueryBuilderProperty<T[ K ]>;
}

export type QueryBuilderProperty<T> = T extends any[] ? QueryBuilderArray<T>
        : T extends NameRef ? IQueryProperty
        : T extends object ? QueryBuilder<T>
        : IQueryProperty;

export type QueryBuilderResult = ( IQueryProperty | QueryBuilder<any> | QueryBuilderArray<any> )[];

export type QueryBuilderFunction<T extends object> = ( obj: QueryBuilder<T> ) => QueryBuilderResult | QueryBuilderResult[];

/**
 * The query function is a helper method that allows you to write more compact queries.
 * For example, if in your query, you have:
 * ```ts
 * query.prepareQuery( ExampleStruct, ( a ) => [
 *     a.b.c.d.e1,
 *     a.b.c.d.e2,
 *     a.b.c.d.e3,
 *     a.b.c.d.e4,
 *     a.b.c.d.e5
 * ] );
 * ```
 * You can shorten this using the query method as follows:
 * ```ts
 * query.prepareQuery( ExampleStruct, ( a ) => [
 *     query( a.b.c.d, ( d ) => [
 *          d.e1,
 *          d.e2,
 *          d.e3,
 *          d.e4,
 *          d.e5
 *     ] ),
 * ] );
 * ```
 * You can nest the query method.
 * 
 * @param builder Base object to pass to the callback
 * @param callback Callback which returns an array of all properties to query.
 */
export function query<T extends object>( builder: QueryBuilder<T>, callback: ( builder: QueryBuilder<T> ) => QueryBuilderResult | QueryBuilderResult[] ): QueryBuilderResult {
    return callback( builder ).flat();
}