#include <iostream>
#include <fstream>
#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

int main() {
    
    std::ifstream file("mock_all_data.json");
    if (!file.is_open()) {
        std::cerr << "{\"error\": \"Could not locate mock_all_data.json\"}\n";
        return 1;
    }

    json masterData;
    try {
        file >> masterData;
    } catch (const json::parse_error& e) {
        std::cerr << "{\"error\": \"JSON Parse Error: " << e.what() << "\"}\n";
        return 1;
    }

    
    json timelineDashboard;
    
    
    timelineDashboard["metadata"] = masterData["metadata"];
    timelineDashboard["employee"] = {
        {"id", masterData["employee_id"]},
        {"name", masterData["employee_name"]}
    };
    
    timelineDashboard["timeline"] = json::object();

    
    auto groupIntoTimeline = [&](const std::string& platformKey, const std::string& platformName) {
        if (masterData.contains(platformKey)) {
            for (const auto& item : masterData[platformKey]) {
                std::string full_date = item["date"];
                std::string year_month = full_date.substr(0, 7); // Extracts "2026-01"
                
                
                timelineDashboard["timeline"][year_month][platformName].push_back(item);
            }
        }
    };

    
    groupIntoTimeline("github", "GitHub");
    groupIntoTimeline("jira", "Jira");
    groupIntoTimeline("notion", "Notion");
    groupIntoTimeline("slack", "Slack");
    groupIntoTimeline("trello", "Trello");
    
    std::cout << timelineDashboard.dump(4) << "\n";

    return 0;
}