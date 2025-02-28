module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: ".*\\.test\\.ts$", // ou qualquer padrão que você preferir
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
};
