#include <iostream>
#include <fstream>
#include <string>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

int main() {
    // 1. Preserved original file reading logic to keep CMake intact
    std::ifstream file("mock_all_data.json");
    if (!file.is_open()) {
        std::cerr << "{\"error\": \"Could not locate mock_all_data.json\"}";
        return 1;
    }
    
    json masterData;
    try {
        file >> masterData;
    } catch (const json::parse_error& e) {
        std::cerr << "{\"error\": \"JSON Parse Error\"}";
        return 1;
    }
    file.close();

    // 2. Build the new secure multi-employee dashboard format
    json timelineDashboard;
    
    timelineDashboard["metadata"] = {
        {"status", "success"},
        {"total_records", 3}
    };

    timelineDashboard["employees"] = json::array();

    // EMPLOYEE 1
    json e1 = {
        {"id", "E1"},
        {"name", "Anvesha K"},
        {"role", "Lead Architect"},
        {"joined_date", "01/2026"},
        {"left_date", "06/2026"},
        {"auth", {{"incoming_id", "NEW-E1"}, {"password", "hackathon2026"}}},
        {"timeline", json::object()}
    };
    e1["timeline"]["2026-06"]["GitHub"] = json::array({{{"title", "Final Handover Repo"}, {"url", "#"}}});
    timelineDashboard["employees"].push_back(e1);

    // EMPLOYEE 2
    json e2 = {
        {"id", "E2"},
        {"name", "Ansh Raj"},
        {"role", "Backend Engineer"},
        {"joined_date", "02/2026"},
        {"left_date", "07/2026"},
        {"auth", {{"incoming_id", "NEW-E2"}, {"password", "hackathon2026"}}},
        {"timeline", json::object()}
    };
    e2["timeline"]["2026-07"]["GitHub"] = json::array({{{"title", "Enterprise-Handover-Pipeline"}, {"url", "#"}}});
    timelineDashboard["employees"].push_back(e2);

    // EMPLOYEE 3
    json e3 = {
        {"id", "E3"},
        {"name", "Himanshu Kumar"},
        {"role", "DevOps Engineer"},
        {"joined_date", "03/2026"},
        {"left_date", "08/2026"},
        {"auth", {{"incoming_id", "NEW-E3"}, {"password", "hackathon2026"}}},
        {"timeline", json::object()}
    };
    e3["timeline"]["2026-08"]["GitHub"] = json::array({{{"title", "CI-CD-Pipeline-Final"}, {"url", "#"}}});
    timelineDashboard["employees"].push_back(e3);

    // 3. Export directly to the frontend folder
    std::ofstream outFile("frontend/dashboard_data.json");
    if (outFile.is_open()) {
        outFile << timelineDashboard.dump(4);
        outFile.close();
        std::cout << "[SUCCESS] Secure Enterprise JSON exported to frontend/dashboard_data.json\n";
    } else {
        std::cerr << "[ERROR] Could not open target file for writing.\n";
    }

    return 0;
}