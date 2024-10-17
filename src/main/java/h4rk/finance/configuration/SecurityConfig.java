package h4rk.finance.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import h4rk.finance.security.service.UserService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
    private UserService userService;
	
    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		return http
    	.authorizeHttpRequests(auth -> 
        	auth
			.requestMatchers("/**").permitAll())
		// 	.requestMatchers("/login", "/register", "/logout", "/error").permitAll()
		// 	.anyRequest().authenticated())
		// .formLogin(form -> 
		// 	form.loginPage("/login")
		// 	.permitAll())
		// .logout(logout -> 
		// 	logout
		// 	.logoutUrl("/logout")
		// 	.logoutSuccessUrl("/login")
		// 	.invalidateHttpSession(true)
		// 	.clearAuthentication(true)
		// 	.deleteCookies("JSESSIONID")
		// 	.permitAll())
      .csrf((csrf) -> csrf.ignoringRequestMatchers("/**"))
      .build();
    }

	@Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}