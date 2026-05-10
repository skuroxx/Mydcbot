# STEP 1: Use the .NET SDK to build the code
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore any libraries (like YoutubeExplode)
COPY ["YourProjectName.csproj", "./"]
RUN dotnet restore

# Copy all your .cs files and build the app
COPY . .
RUN dotnet publish -c Release -o /app/publish

# STEP 2: Use the Runtime to run the app (keeps it lightweight)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Tell Render to use Port 8080
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

# Start the application
ENTRYPOINT ["dotnet", "YourProjectName.dll"]
