package h4rk.finance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MockupController {

    @GetMapping("/budget-planner")
    public String budgetPlanner(Model model) {
        model.addAttribute("pageTitle", "Budget Planner");
        return "mockup/budgetplanner";
    }

    @GetMapping("/analytics")
    public String analytics(Model model) {
        model.addAttribute("pageTitle", "Analytics");
        return "mockup/analytics";
    }

    @GetMapping("/category-management")
    public String categoryManagement(Model model) {
        model.addAttribute("pageTitle", "Category Management");
        return "mockup/category-management";
    }

    @GetMapping("/movement-history")
    public String movementHistory(Model model) {
        model.addAttribute("pageTitle", "Movement History");
        return "mockup/movement-history";
    }

    @GetMapping("/user-profile")
    public String userProfile(Model model) {
        model.addAttribute("pageTitle", "User Profile");
        return "mockup/user-profile";
    }

    @GetMapping("/reports")
    public String reports(Model model) {
        model.addAttribute("pageTitle", "Reports");
        return "mockup/reports";
    }
}
