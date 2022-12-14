import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { mapSchema, MapperKind, getDirectives } from '@graphql-tools/utils';

export function attachDirectiveResolvers(
    schema: GraphQLSchema,
    directiveResolvers: {[key: string]: Function},
): GraphQLSchema {
    // ... argument validation ...

    return mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            const newFieldConfig = { ...fieldConfig };

            const directives = getDirectives(schema, fieldConfig);
            for (const directive of directives) {
                const directiveName = directive.name;
                if (directiveResolvers[directiveName]) {
                    const resolver = directiveResolvers[directiveName];
                    const originalResolver =
                        newFieldConfig.resolve != null ? newFieldConfig.resolve : defaultFieldResolver;
                    const directiveArgs = directive.args;
                    newFieldConfig.resolve = (source, originalArgs, context, info) => {
                        return resolver(
                            () =>
                                new Promise((resolve, reject) => {
                                    const result = originalResolver(source, originalArgs, context, info);
                                    if (result instanceof Error) {
                                        reject(result);
                                    }
                                    resolve(result);
                                }),
                            source,
                            directiveArgs,
                            context,
                            info,
                        );
                    };
                }
            }

            return newFieldConfig;
        },
    });
}
