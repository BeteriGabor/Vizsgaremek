package com.casino.UserManagementSystem.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.parameters.Parameter;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("User Management API")
                        .description("API for user management including file uploads.")
                        .version("1.0.0"))
                .addSecurityItem(new SecurityRequirement().addList("JWT Bearer"))
                .components(new Components()
                        .addSecuritySchemes("JWT Bearer", new SecurityScheme()
                                .name("Authorization")
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT"))
                        .addParameters("userId", new Parameter()
                                .in("query")
                                .name("userId")
                                .required(true)
                                .description("User ID")
                                .schema(new Schema().type("integer"))
                        )
                        .addParameters("file", new Parameter()
                                .in("formData")
                                .name("file")
                                .required(true)
                                .description("The file to upload")
                                .schema(new Schema().type("string").format("binary"))
                        )
                );
    }
}
