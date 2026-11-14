#include <iostream>
#include <string>
#include <functional>
#include <sstream>
#include <iomanip>

int main(int argc, char* argv[]) {
    // 1. Check if Node.js sent the password
    if (argc < 2) {
        std::cerr << "Error: No passkey provided." << std::endl;
        return 1;
    }

    std::string password = argv[1];
    
    // 2. Add a secure salt for the hackathon prototype
    std::string salt = "TechyVengers_Darwinbox_2026"; 
    std::string saltedPassword = password + salt;

    // 3. Generate the hash
    std::hash<std::string> hasher;
    size_t hashValue = hasher(saltedPassword);

    // 4. Convert the hash to a 16-character hex string
    std::stringstream hexStream;
    hexStream << std::hex << std::setw(16) << std::setfill('0') << hashValue;

    // 5. Print ONLY the hash so Node.js can capture it cleanly
    std::cout << hexStream.str();

    return 0;
}