// utils/hasher.cpp
#include <iostream>
#include <string>

unsigned int simpleHash(const std::string& str) {
    unsigned int hash = 0;
    for (char c : str) {
        hash = 31 * hash + c;
    }
    return hash;
}

int main() {
    std::cout << "Handover Hash Check: " << simpleHash("TechyVengers2026") << std::endl;
    return 0;
}