use std::process::Command;

#[tauri::command]
fn check_gemini_cli_status() -> bool {
    // 1. Try running "which gemini"
    let which_status = Command::new("which")
        .arg("gemini")
        .status()
        .map(|s| s.success())
        .unwrap_or(false);

    if which_status {
        return true;
    }

    // 2. Try running "gemini --version"
    Command::new("gemini")
        .arg("--version")
        .status()
        .map(|s| s.success())
        .unwrap_or(false)
}

#[tauri::command]
async fn run_gemini_cli(prompt: String) -> Result<String, String> {
    // Spawn the system command "gemini -p <prompt> --skip-trust --yolo"
    let output = Command::new("gemini")
        .args(&["-p", &prompt, "--skip-trust", "--yolo"])
        .output();

    match output {
        Ok(out) => {
            if out.status.success() {
                String::from_utf8(out.stdout)
                    .map_err(|e| format!("Failed to parse stdout: {}", e))
            } else {
                let stderr = String::from_utf8(out.stderr)
                    .unwrap_or_else(|_| "Unknown error".to_string());
                Err(format!("Gemini CLI failed: {}", stderr))
            }
        }
        Err(e) => Err(format!(
            "Failed to execute Gemini CLI. Ensure it is installed in your system PATH. Error: {}",
            e
        )),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
        check_gemini_cli_status,
        run_gemini_cli
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

