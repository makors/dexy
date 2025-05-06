#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use dexrs::dexcom::client::DexcomClient;
use std::sync::Mutex;
use tauri::{Builder, Manager, State};

struct AppData {
    dexc: Option<DexcomClient>,
    count: i8
}

#[tauri::command]
fn setup_dexcom_client(username: String, password: String, state: State<'_, Mutex<AppData>>) -> bool {
    let mut s = state.lock().unwrap();
    let dexcom_client = DexcomClient::new(username, password, false);

    match dexcom_client {
        Ok(c) => {
            s.dexc = Some(c);
            true
        },
        Err(_) => false
    } 
}

#[tauri::command]
fn get_most_recent_reading(state: State<'_, Mutex<AppData>>) -> Vec<String> {
    println!("recent reading called");
    let mut s = state.lock().unwrap();
    if s.dexc.is_none() {
        return vec![123.to_string(), "->".to_string(), "2021-01-01T00:00:00".to_string()];
    }

    if s.count > 10 {
        println!("limited, to ensure runaway doesn't happen");
        return vec![123.to_string(), "->".to_string(), "2021-01-01T00:00:00".to_string()];
    }

    s.count += 1;

    let dexc = s.dexc.as_ref().unwrap();
    let readings = dexc.get_glucose_readings(None, None).unwrap();
    
    let most_recent_reading = readings.into_iter().next().unwrap(); // This moves the first element out

    vec![most_recent_reading.mg_dl.to_string(), most_recent_reading.trend.arrow.to_string(), most_recent_reading.datetime]
}


fn main() {
    let context = tauri::generate_context!();
    Builder::default()
        .setup(|app| {
            app.manage(Mutex::new(AppData { dexc: None, count: 0 }));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![setup_dexcom_client, get_most_recent_reading])
        .run(context)
        .expect("error while running tauri application");
}
