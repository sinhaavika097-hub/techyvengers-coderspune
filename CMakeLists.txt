cmake_minimum_required(VERSION 3.15)
set(CMAKE_C_COMPILER "C:/mingw64/bin/gcc.exe")
set(CMAKE_CXX_COMPILER "C:/mingw64/bin/g++.exe")

project(HandoverAPI)
set(CMAKE_CXX_STANDARD 17)

include(FetchContent)


set(JSON_BuildTests OFF CACHE INTERNAL "")
FetchContent_Declare(json GIT_REPOSITORY https://github.com/nlohmann/json.git GIT_TAG v3.11.3)
FetchContent_MakeAvailable(json)

add_executable(${PROJECT_NAME} mainfetch.cpp)
target_link_libraries(${PROJECT_NAME} PRIVATE nlohmann_json::nlohmann_json)