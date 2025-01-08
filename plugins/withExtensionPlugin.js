const fs = require('fs-extra')
const path = require('path')
const { withDangerousMod, withXcodeProject } = require('@expo/config-plugins')
const xcode = require('xcode')

// This function handles the copying of the notification content extension files
function copyExtensionFiles(config, optionsList) {
  return withDangerousMod(config, [
    'ios',
    async config => {
      for (const options of optionsList) {
        const srcDir = path.resolve(options.ios.sourceDir)
        const destDir = path.resolve(
          config.modRequest.platformProjectRoot,
          options.ios.extensionTargetName
        )

        try {
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true })
          }
          await fs.copy(srcDir, destDir, {
            overwrite: true,
          })
          options.ios.sourceDir = destDir
        } catch (error) {
          console.error(`Failed to copy files: ${error.message}`)
        }
      }
      return config
    },
  ])
}

// Ensures that the specified group exists in the Xcode project
function ensureGroupExists(project, groupName) {
  let group = project.pbxGroupByName(groupName)
  if (!group) {
    project.addPbxGroup([], groupName, groupName)
    group = project.pbxGroupByName(groupName)
  }
  return group
}

// Recursively adds source files from the specified directory to the Xcode project
function addSourceFilesFromDir(project, dirPath, targetUUID) {
  const files = fs.readdirSync(dirPath)

  files.forEach(file => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      addSourceFilesFromDir(project, filePath, targetUUID) // Recursively add files from subdirectories
    } else if (fs.statSync(filePath).isFile()) {
      project.addSourceFile(filePath, { target: targetUUID })
    }
  })
}

// This function handles the setup of the notification content extension target in the Xcode project
function createExtensionTarget(config, optionsList) {
  return withXcodeProject(config, async config => {
    const projectName = config.modRequest.projectName
    // Path to the .pbxproj file
    const projectPath = path.join(
      config.modRequest.platformProjectRoot,
      `${projectName}.xcodeproj/project.pbxproj`
    )
    // Load and parse the Xcode project
    const project = xcode.project(projectPath)

    project.parse(err => {
      if (err) {
        console.error('Failed to parse Xcode project:', err)
        return
      }

      optionsList.forEach(options => {
        const extensionName = options.ios.extensionTargetName
        const extensionBundleId = `${options.ios.baseBundleId}.${extensionName}`

        // Create a new target for the notification content extension
        const target = project.addTarget(
          extensionName,
          'app_extension',
          extensionName,
          extensionBundleId,
          options.ios.pointIdentifier
        )

        // Add build phases for the new target
        if (options.ios.buildPhases) {
          options.ios.buildPhases.forEach(phase => {
            project.addBuildPhase([], phase.type, phase.name, target.uuid)
          })
        }

        // Ensure necessary groups exist in the project
        ensureGroupExists(project, 'Plugins')
        ensureGroupExists(project, 'Resources')
        ensureGroupExists(project, 'Frameworks')

        // Add required frameworks to the target
        if (options.ios.frameworks) {
          options.ios.frameworks.forEach(framework => {
            project.addFramework(framework, {
              target: target.uuid,
            })
          })
        }

        // Ensure the Base.lproj group exists and add its resources to the project
        if (options.ios.isBaselproj) {
          let baseGroup = project.pbxGroupByName('Base.lproj')
          if (!baseGroup) {
            baseGroup = project.addPbxGroup([], 'Base.lproj', 'Base.lproj')
          }
        }

        // Add all Swift source files from the specified directories
        addSourceFilesFromDir(project, options.ios.sourceDir, target.uuid)

        // Set the iOS deployment target and Swift version
        const configurations = Object.values(
          project.pbxXCBuildConfigurationSection()
        ).filter(
          config => config.buildSettings?.PRODUCT_NAME === `"${extensionName}"`
        )
        configurations.forEach(configuration => {
          Object.assign(configuration.buildSettings, options.ios.buildSettings)
        })
      })

      // Save the changes to the project file
      fs.writeFileSync(projectPath, project.writeSync())
    })
    return config
  })
}

module.exports = function withExtensionPlugin(config, optionsList) {
  config = copyExtensionFiles(config, optionsList)
  config = createExtensionTarget(config, optionsList)
  return config
}
