
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model signupData
 * 
 */
export type signupData = $Result.DefaultSelection<Prisma.$signupDataPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more SignupData
 * const signupData = await prisma.signupData.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more SignupData
   * const signupData = await prisma.signupData.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.signupData`: Exposes CRUD operations for the **signupData** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SignupData
    * const signupData = await prisma.signupData.findMany()
    * ```
    */
  get signupData(): Prisma.signupDataDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    signupData: 'signupData'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "signupData"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      signupData: {
        payload: Prisma.$signupDataPayload<ExtArgs>
        fields: Prisma.signupDataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.signupDataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$signupDataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.signupDataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$signupDataPayload>
          }
          findFirst: {
            args: Prisma.signupDataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$signupDataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.signupDataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$signupDataPayload>
          }
          findMany: {
            args: Prisma.signupDataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$signupDataPayload>[]
          }
          create: {
            args: Prisma.signupDataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$signupDataPayload>
          }
          createMany: {
            args: Prisma.signupDataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.signupDataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$signupDataPayload>[]
          }
          delete: {
            args: Prisma.signupDataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$signupDataPayload>
          }
          update: {
            args: Prisma.signupDataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$signupDataPayload>
          }
          deleteMany: {
            args: Prisma.signupDataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.signupDataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.signupDataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$signupDataPayload>[]
          }
          upsert: {
            args: Prisma.signupDataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$signupDataPayload>
          }
          aggregate: {
            args: Prisma.SignupDataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSignupData>
          }
          groupBy: {
            args: Prisma.signupDataGroupByArgs<ExtArgs>
            result: $Utils.Optional<SignupDataGroupByOutputType>[]
          }
          count: {
            args: Prisma.signupDataCountArgs<ExtArgs>
            result: $Utils.Optional<SignupDataCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    signupData?: signupDataOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model signupData
   */

  export type AggregateSignupData = {
    _count: SignupDataCountAggregateOutputType | null
    _min: SignupDataMinAggregateOutputType | null
    _max: SignupDataMaxAggregateOutputType | null
  }

  export type SignupDataMinAggregateOutputType = {
    token: string | null
    email: string | null
    expiresAt: Date | null
    username: string | null
    passwordHash: string | null
  }

  export type SignupDataMaxAggregateOutputType = {
    token: string | null
    email: string | null
    expiresAt: Date | null
    username: string | null
    passwordHash: string | null
  }

  export type SignupDataCountAggregateOutputType = {
    token: number
    email: number
    expiresAt: number
    username: number
    passwordHash: number
    _all: number
  }


  export type SignupDataMinAggregateInputType = {
    token?: true
    email?: true
    expiresAt?: true
    username?: true
    passwordHash?: true
  }

  export type SignupDataMaxAggregateInputType = {
    token?: true
    email?: true
    expiresAt?: true
    username?: true
    passwordHash?: true
  }

  export type SignupDataCountAggregateInputType = {
    token?: true
    email?: true
    expiresAt?: true
    username?: true
    passwordHash?: true
    _all?: true
  }

  export type SignupDataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which signupData to aggregate.
     */
    where?: signupDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of signupData to fetch.
     */
    orderBy?: signupDataOrderByWithRelationInput | signupDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: signupDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` signupData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` signupData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned signupData
    **/
    _count?: true | SignupDataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SignupDataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SignupDataMaxAggregateInputType
  }

  export type GetSignupDataAggregateType<T extends SignupDataAggregateArgs> = {
        [P in keyof T & keyof AggregateSignupData]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSignupData[P]>
      : GetScalarType<T[P], AggregateSignupData[P]>
  }




  export type signupDataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: signupDataWhereInput
    orderBy?: signupDataOrderByWithAggregationInput | signupDataOrderByWithAggregationInput[]
    by: SignupDataScalarFieldEnum[] | SignupDataScalarFieldEnum
    having?: signupDataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SignupDataCountAggregateInputType | true
    _min?: SignupDataMinAggregateInputType
    _max?: SignupDataMaxAggregateInputType
  }

  export type SignupDataGroupByOutputType = {
    token: string
    email: string
    expiresAt: Date
    username: string
    passwordHash: string
    _count: SignupDataCountAggregateOutputType | null
    _min: SignupDataMinAggregateOutputType | null
    _max: SignupDataMaxAggregateOutputType | null
  }

  type GetSignupDataGroupByPayload<T extends signupDataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SignupDataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SignupDataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SignupDataGroupByOutputType[P]>
            : GetScalarType<T[P], SignupDataGroupByOutputType[P]>
        }
      >
    >


  export type signupDataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    token?: boolean
    email?: boolean
    expiresAt?: boolean
    username?: boolean
    passwordHash?: boolean
  }, ExtArgs["result"]["signupData"]>

  export type signupDataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    token?: boolean
    email?: boolean
    expiresAt?: boolean
    username?: boolean
    passwordHash?: boolean
  }, ExtArgs["result"]["signupData"]>

  export type signupDataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    token?: boolean
    email?: boolean
    expiresAt?: boolean
    username?: boolean
    passwordHash?: boolean
  }, ExtArgs["result"]["signupData"]>

  export type signupDataSelectScalar = {
    token?: boolean
    email?: boolean
    expiresAt?: boolean
    username?: boolean
    passwordHash?: boolean
  }

  export type signupDataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"token" | "email" | "expiresAt" | "username" | "passwordHash", ExtArgs["result"]["signupData"]>

  export type $signupDataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "signupData"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      token: string
      email: string
      expiresAt: Date
      username: string
      passwordHash: string
    }, ExtArgs["result"]["signupData"]>
    composites: {}
  }

  type signupDataGetPayload<S extends boolean | null | undefined | signupDataDefaultArgs> = $Result.GetResult<Prisma.$signupDataPayload, S>

  type signupDataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<signupDataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SignupDataCountAggregateInputType | true
    }

  export interface signupDataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['signupData'], meta: { name: 'signupData' } }
    /**
     * Find zero or one SignupData that matches the filter.
     * @param {signupDataFindUniqueArgs} args - Arguments to find a SignupData
     * @example
     * // Get one SignupData
     * const signupData = await prisma.signupData.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends signupDataFindUniqueArgs>(args: SelectSubset<T, signupDataFindUniqueArgs<ExtArgs>>): Prisma__signupDataClient<$Result.GetResult<Prisma.$signupDataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SignupData that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {signupDataFindUniqueOrThrowArgs} args - Arguments to find a SignupData
     * @example
     * // Get one SignupData
     * const signupData = await prisma.signupData.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends signupDataFindUniqueOrThrowArgs>(args: SelectSubset<T, signupDataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__signupDataClient<$Result.GetResult<Prisma.$signupDataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SignupData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {signupDataFindFirstArgs} args - Arguments to find a SignupData
     * @example
     * // Get one SignupData
     * const signupData = await prisma.signupData.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends signupDataFindFirstArgs>(args?: SelectSubset<T, signupDataFindFirstArgs<ExtArgs>>): Prisma__signupDataClient<$Result.GetResult<Prisma.$signupDataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SignupData that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {signupDataFindFirstOrThrowArgs} args - Arguments to find a SignupData
     * @example
     * // Get one SignupData
     * const signupData = await prisma.signupData.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends signupDataFindFirstOrThrowArgs>(args?: SelectSubset<T, signupDataFindFirstOrThrowArgs<ExtArgs>>): Prisma__signupDataClient<$Result.GetResult<Prisma.$signupDataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SignupData that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {signupDataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SignupData
     * const signupData = await prisma.signupData.findMany()
     * 
     * // Get first 10 SignupData
     * const signupData = await prisma.signupData.findMany({ take: 10 })
     * 
     * // Only select the `token`
     * const signupDataWithTokenOnly = await prisma.signupData.findMany({ select: { token: true } })
     * 
     */
    findMany<T extends signupDataFindManyArgs>(args?: SelectSubset<T, signupDataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$signupDataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SignupData.
     * @param {signupDataCreateArgs} args - Arguments to create a SignupData.
     * @example
     * // Create one SignupData
     * const SignupData = await prisma.signupData.create({
     *   data: {
     *     // ... data to create a SignupData
     *   }
     * })
     * 
     */
    create<T extends signupDataCreateArgs>(args: SelectSubset<T, signupDataCreateArgs<ExtArgs>>): Prisma__signupDataClient<$Result.GetResult<Prisma.$signupDataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SignupData.
     * @param {signupDataCreateManyArgs} args - Arguments to create many SignupData.
     * @example
     * // Create many SignupData
     * const signupData = await prisma.signupData.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends signupDataCreateManyArgs>(args?: SelectSubset<T, signupDataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SignupData and returns the data saved in the database.
     * @param {signupDataCreateManyAndReturnArgs} args - Arguments to create many SignupData.
     * @example
     * // Create many SignupData
     * const signupData = await prisma.signupData.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SignupData and only return the `token`
     * const signupDataWithTokenOnly = await prisma.signupData.createManyAndReturn({
     *   select: { token: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends signupDataCreateManyAndReturnArgs>(args?: SelectSubset<T, signupDataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$signupDataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SignupData.
     * @param {signupDataDeleteArgs} args - Arguments to delete one SignupData.
     * @example
     * // Delete one SignupData
     * const SignupData = await prisma.signupData.delete({
     *   where: {
     *     // ... filter to delete one SignupData
     *   }
     * })
     * 
     */
    delete<T extends signupDataDeleteArgs>(args: SelectSubset<T, signupDataDeleteArgs<ExtArgs>>): Prisma__signupDataClient<$Result.GetResult<Prisma.$signupDataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SignupData.
     * @param {signupDataUpdateArgs} args - Arguments to update one SignupData.
     * @example
     * // Update one SignupData
     * const signupData = await prisma.signupData.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends signupDataUpdateArgs>(args: SelectSubset<T, signupDataUpdateArgs<ExtArgs>>): Prisma__signupDataClient<$Result.GetResult<Prisma.$signupDataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SignupData.
     * @param {signupDataDeleteManyArgs} args - Arguments to filter SignupData to delete.
     * @example
     * // Delete a few SignupData
     * const { count } = await prisma.signupData.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends signupDataDeleteManyArgs>(args?: SelectSubset<T, signupDataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SignupData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {signupDataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SignupData
     * const signupData = await prisma.signupData.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends signupDataUpdateManyArgs>(args: SelectSubset<T, signupDataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SignupData and returns the data updated in the database.
     * @param {signupDataUpdateManyAndReturnArgs} args - Arguments to update many SignupData.
     * @example
     * // Update many SignupData
     * const signupData = await prisma.signupData.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SignupData and only return the `token`
     * const signupDataWithTokenOnly = await prisma.signupData.updateManyAndReturn({
     *   select: { token: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends signupDataUpdateManyAndReturnArgs>(args: SelectSubset<T, signupDataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$signupDataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SignupData.
     * @param {signupDataUpsertArgs} args - Arguments to update or create a SignupData.
     * @example
     * // Update or create a SignupData
     * const signupData = await prisma.signupData.upsert({
     *   create: {
     *     // ... data to create a SignupData
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SignupData we want to update
     *   }
     * })
     */
    upsert<T extends signupDataUpsertArgs>(args: SelectSubset<T, signupDataUpsertArgs<ExtArgs>>): Prisma__signupDataClient<$Result.GetResult<Prisma.$signupDataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SignupData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {signupDataCountArgs} args - Arguments to filter SignupData to count.
     * @example
     * // Count the number of SignupData
     * const count = await prisma.signupData.count({
     *   where: {
     *     // ... the filter for the SignupData we want to count
     *   }
     * })
    **/
    count<T extends signupDataCountArgs>(
      args?: Subset<T, signupDataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SignupDataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SignupData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SignupDataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SignupDataAggregateArgs>(args: Subset<T, SignupDataAggregateArgs>): Prisma.PrismaPromise<GetSignupDataAggregateType<T>>

    /**
     * Group by SignupData.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {signupDataGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends signupDataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: signupDataGroupByArgs['orderBy'] }
        : { orderBy?: signupDataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, signupDataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSignupDataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the signupData model
   */
  readonly fields: signupDataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for signupData.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__signupDataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the signupData model
   */
  interface signupDataFieldRefs {
    readonly token: FieldRef<"signupData", 'String'>
    readonly email: FieldRef<"signupData", 'String'>
    readonly expiresAt: FieldRef<"signupData", 'DateTime'>
    readonly username: FieldRef<"signupData", 'String'>
    readonly passwordHash: FieldRef<"signupData", 'String'>
  }
    

  // Custom InputTypes
  /**
   * signupData findUnique
   */
  export type signupDataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
    /**
     * Filter, which signupData to fetch.
     */
    where: signupDataWhereUniqueInput
  }

  /**
   * signupData findUniqueOrThrow
   */
  export type signupDataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
    /**
     * Filter, which signupData to fetch.
     */
    where: signupDataWhereUniqueInput
  }

  /**
   * signupData findFirst
   */
  export type signupDataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
    /**
     * Filter, which signupData to fetch.
     */
    where?: signupDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of signupData to fetch.
     */
    orderBy?: signupDataOrderByWithRelationInput | signupDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for signupData.
     */
    cursor?: signupDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` signupData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` signupData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of signupData.
     */
    distinct?: SignupDataScalarFieldEnum | SignupDataScalarFieldEnum[]
  }

  /**
   * signupData findFirstOrThrow
   */
  export type signupDataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
    /**
     * Filter, which signupData to fetch.
     */
    where?: signupDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of signupData to fetch.
     */
    orderBy?: signupDataOrderByWithRelationInput | signupDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for signupData.
     */
    cursor?: signupDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` signupData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` signupData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of signupData.
     */
    distinct?: SignupDataScalarFieldEnum | SignupDataScalarFieldEnum[]
  }

  /**
   * signupData findMany
   */
  export type signupDataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
    /**
     * Filter, which signupData to fetch.
     */
    where?: signupDataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of signupData to fetch.
     */
    orderBy?: signupDataOrderByWithRelationInput | signupDataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing signupData.
     */
    cursor?: signupDataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` signupData from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` signupData.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of signupData.
     */
    distinct?: SignupDataScalarFieldEnum | SignupDataScalarFieldEnum[]
  }

  /**
   * signupData create
   */
  export type signupDataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
    /**
     * The data needed to create a signupData.
     */
    data: XOR<signupDataCreateInput, signupDataUncheckedCreateInput>
  }

  /**
   * signupData createMany
   */
  export type signupDataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many signupData.
     */
    data: signupDataCreateManyInput | signupDataCreateManyInput[]
  }

  /**
   * signupData createManyAndReturn
   */
  export type signupDataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
    /**
     * The data used to create many signupData.
     */
    data: signupDataCreateManyInput | signupDataCreateManyInput[]
  }

  /**
   * signupData update
   */
  export type signupDataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
    /**
     * The data needed to update a signupData.
     */
    data: XOR<signupDataUpdateInput, signupDataUncheckedUpdateInput>
    /**
     * Choose, which signupData to update.
     */
    where: signupDataWhereUniqueInput
  }

  /**
   * signupData updateMany
   */
  export type signupDataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update signupData.
     */
    data: XOR<signupDataUpdateManyMutationInput, signupDataUncheckedUpdateManyInput>
    /**
     * Filter which signupData to update
     */
    where?: signupDataWhereInput
    /**
     * Limit how many signupData to update.
     */
    limit?: number
  }

  /**
   * signupData updateManyAndReturn
   */
  export type signupDataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
    /**
     * The data used to update signupData.
     */
    data: XOR<signupDataUpdateManyMutationInput, signupDataUncheckedUpdateManyInput>
    /**
     * Filter which signupData to update
     */
    where?: signupDataWhereInput
    /**
     * Limit how many signupData to update.
     */
    limit?: number
  }

  /**
   * signupData upsert
   */
  export type signupDataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
    /**
     * The filter to search for the signupData to update in case it exists.
     */
    where: signupDataWhereUniqueInput
    /**
     * In case the signupData found by the `where` argument doesn't exist, create a new signupData with this data.
     */
    create: XOR<signupDataCreateInput, signupDataUncheckedCreateInput>
    /**
     * In case the signupData was found with the provided `where` argument, update it with this data.
     */
    update: XOR<signupDataUpdateInput, signupDataUncheckedUpdateInput>
  }

  /**
   * signupData delete
   */
  export type signupDataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
    /**
     * Filter which signupData to delete.
     */
    where: signupDataWhereUniqueInput
  }

  /**
   * signupData deleteMany
   */
  export type signupDataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which signupData to delete
     */
    where?: signupDataWhereInput
    /**
     * Limit how many signupData to delete.
     */
    limit?: number
  }

  /**
   * signupData without action
   */
  export type signupDataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the signupData
     */
    select?: signupDataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the signupData
     */
    omit?: signupDataOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SignupDataScalarFieldEnum: {
    token: 'token',
    email: 'email',
    expiresAt: 'expiresAt',
    username: 'username',
    passwordHash: 'passwordHash'
  };

  export type SignupDataScalarFieldEnum = (typeof SignupDataScalarFieldEnum)[keyof typeof SignupDataScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type signupDataWhereInput = {
    AND?: signupDataWhereInput | signupDataWhereInput[]
    OR?: signupDataWhereInput[]
    NOT?: signupDataWhereInput | signupDataWhereInput[]
    token?: StringFilter<"signupData"> | string
    email?: StringFilter<"signupData"> | string
    expiresAt?: DateTimeFilter<"signupData"> | Date | string
    username?: StringFilter<"signupData"> | string
    passwordHash?: StringFilter<"signupData"> | string
  }

  export type signupDataOrderByWithRelationInput = {
    token?: SortOrder
    email?: SortOrder
    expiresAt?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
  }

  export type signupDataWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    AND?: signupDataWhereInput | signupDataWhereInput[]
    OR?: signupDataWhereInput[]
    NOT?: signupDataWhereInput | signupDataWhereInput[]
    email?: StringFilter<"signupData"> | string
    expiresAt?: DateTimeFilter<"signupData"> | Date | string
    username?: StringFilter<"signupData"> | string
    passwordHash?: StringFilter<"signupData"> | string
  }, "token">

  export type signupDataOrderByWithAggregationInput = {
    token?: SortOrder
    email?: SortOrder
    expiresAt?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    _count?: signupDataCountOrderByAggregateInput
    _max?: signupDataMaxOrderByAggregateInput
    _min?: signupDataMinOrderByAggregateInput
  }

  export type signupDataScalarWhereWithAggregatesInput = {
    AND?: signupDataScalarWhereWithAggregatesInput | signupDataScalarWhereWithAggregatesInput[]
    OR?: signupDataScalarWhereWithAggregatesInput[]
    NOT?: signupDataScalarWhereWithAggregatesInput | signupDataScalarWhereWithAggregatesInput[]
    token?: StringWithAggregatesFilter<"signupData"> | string
    email?: StringWithAggregatesFilter<"signupData"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"signupData"> | Date | string
    username?: StringWithAggregatesFilter<"signupData"> | string
    passwordHash?: StringWithAggregatesFilter<"signupData"> | string
  }

  export type signupDataCreateInput = {
    token: string
    email: string
    expiresAt: Date | string
    username: string
    passwordHash: string
  }

  export type signupDataUncheckedCreateInput = {
    token: string
    email: string
    expiresAt: Date | string
    username: string
    passwordHash: string
  }

  export type signupDataUpdateInput = {
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
  }

  export type signupDataUncheckedUpdateInput = {
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
  }

  export type signupDataCreateManyInput = {
    token: string
    email: string
    expiresAt: Date | string
    username: string
    passwordHash: string
  }

  export type signupDataUpdateManyMutationInput = {
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
  }

  export type signupDataUncheckedUpdateManyInput = {
    token?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type signupDataCountOrderByAggregateInput = {
    token?: SortOrder
    email?: SortOrder
    expiresAt?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
  }

  export type signupDataMaxOrderByAggregateInput = {
    token?: SortOrder
    email?: SortOrder
    expiresAt?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
  }

  export type signupDataMinOrderByAggregateInput = {
    token?: SortOrder
    email?: SortOrder
    expiresAt?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}