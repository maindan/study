package com.study.study.config.exceptions;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomHandlerExceptionResolver implements HandlerExceptionResolver {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public ModelAndView resolveException(HttpServletRequest request,
                                         HttpServletResponse response,
                                         Object handler,
                                         Exception ex) {

        HttpStatus status;
        String message;

        // 401 - Credenciais inválidas (usuário/senha errados)
        if (ex instanceof org.springframework.security.authentication.BadCredentialsException) {
            status = HttpStatus.UNAUTHORIZED;
            message = "Usuário ou senha inválido";
            System.out.println("Chegou até aqui");
        }
        // 401 - Token inválido / expirado
        else if (ex instanceof ExpiredJwtException
                || ex instanceof JwtException
                || ex instanceof JWTVerificationException) {
            status = HttpStatus.UNAUTHORIZED;
            message = "Token inválido ou expirado";
            System.out.println("Chegou até aqui na vdd");
        }
        // 401 - Outras falhas de autenticação
        else if (ex instanceof AuthenticationException
                || ex instanceof InsufficientAuthenticationException) {
            status = HttpStatus.UNAUTHORIZED;
            message = "Não autenticado";
        }
        // 403 - Acesso negado
        else if (ex instanceof AccessDeniedException
                || ex.getClass().getName().contains("AuthorizationDeniedException")) {
            status = HttpStatus.FORBIDDEN;
            message = "Acesso negado";
        }
        // 500 - Erro genérico
        else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = ex.getMessage();
        }

        response.setStatus(status.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        try {
            objectMapper.writeValue(response.getWriter(), body);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new ModelAndView();
    }
}
