<h1 style="border:0;font-weight:bold" align="center">sprocket</h1>

sprocket is a CLI application written in [deno](https://deno.com/) to simplify dev-related work in the KinsonDigital organization.

### Install/Update
```bash
# Installs or updates the tool using the latest version of the installer
deno run -NRW jsr:@kinsondigital/sprocket/install.ts

# Installs or updates the tool using a specific version of the installer
deno run -NRW jsr:@kinsondigital/sprocket@v1.2.3/install.ts
```

### Note:

You can name your sprocket config file anything you want as well as put it anywhere you want in
the project.  Updating the version of the tool in the deno.json file using the install command
above does not remove or malform the path to the config file.
