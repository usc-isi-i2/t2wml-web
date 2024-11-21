# T2WML: For The Web

Web-based application for T2WML, used to run alongside the main project here: https://github.com/usc-isi-i2/t2wml  

The default setting is to use port `13000` for the back-end API.  

## Instructions



### How to upload a structured data file (Excel or CSV) containing timeseries data

From the main window (as shown in picture below; the designated file upload area is outlined in red) users are able to upload data files (Excel or CSV).  
This can be done by clicking anywhere inside the designated upload area and choosing a file from the file system browser, or simply "dragging" the file into the designated file upload area.  

![2 3 1_upload_annotated](https://github.com/user-attachments/assets/faa66715-31b9-41a9-83c7-e55d1f6b148a)

Once the file upload is finished and upload successful message is shown, the data will be processed into a table overview.  
Instructions on how to annotate the data will be shown on the right hand side.  

![2 3 1_data_processed_annotated](https://github.com/user-attachments/assets/db71b2fc-4564-471f-856d-9a99027e4836)



### How to select the country annotation region

With data uploaded and processed into the table overview, users can start annotating.  
Users are able to select the countries as the main subject in the table following these actions:
  1. Select the area by pressing down the left mouse button and holding it while moving in the desired direction.
     Alternatively users can select an area and use the draggable square in the bottom right corner to resize the selection.
  2. Adjust the range of the selected area by changing the column and/or row in the annotation pop-up.
  3. Select country as the main subject from the "role" dropdown menu in the annotation pop-up.
  4. Confirm the selected area by pressing the "Submit new annotation" button.

![2 3 2_select_countries_annotated](https://github.com/user-attachments/assets/afcc56de-ef48-4f3e-8f7e-24de8815c9db)

Once the annotation is confirmed and the success message is shown - the selected area with the countries will be highlighted in blue.  
Country names are automatically wikified (connected to the respective Qnodes in WikiData) and also highlighted in blue.  
In addition, the wikified countries should now appear in the output preview on the right hand side.  

![2 3 2_main_subject_annotated](https://github.com/user-attachments/assets/77b74f21-1c40-4c8c-b9d2-e0d1900e58fb)



### How to select the time qualifier annotation region

In order to annotate the time qualifier area in the data table:
  1. Select the area by pressing down the left mouse button and holding it while moving in the desired direction.
     Alternatively users can select an area and use the draggable square in the bottom right corner to resize the selection.
  2. Adjust the range of the selected area by changing the column and/or row in the annotation pop-up.
  3. Select qualifier from the "role" dropdown menu in the annotation pop-up.
  4. Select time from the "type" dropdown menu in the annotation pop-up.
  5. Confirm the selected area by pressing the "Submit new annotation" button.

![2 3 3_select_time_annotated](https://github.com/user-attachments/assets/3fa2c0f0-8c1e-478c-8077-aceba8e6d00a)

Once the annotation is confirmed and the success message is shown - the selected area with the time qualifier will be highlighted in purple.  
If additional information is required, users can expand the annotation menu by pressing on the "Show additional inputs" button and enter precision and format of the time values as shown in the image below.  
Annotated time qualifier should now appear in the output preview on the right hand side.  

![2 3 3_select_time_additional_inputs_annotated](https://github.com/user-attachments/assets/865380b8-a002-4d15-adbe-3e1404993c83)



### How to select the dependent variable annotation region

In order to annotate the dependent variable area in the data table:
  1. Select the area by pressing down the left mouse button and holding it while moving in the desired direction.
     Alternatively users can select an area and use the draggable square in the bottom right corner to resize the selection.
  2. Adjust the range of the selected area by changing the column and/or row in the annotation pop-up.
  3. Select dependent variable from the "role" dropdown menu.
  4. Select the correct variable type from the "type" dropdown menu in the annotation pop-up.
     The choices are "string", "quantity", "time" and "country".
     Each of which are explained in the tooltips marked with a (?).
  5. Confirm the selected area by pressing the "Submit new annotation" button.

![2 3 4_select_dependent_variable_annotated](https://github.com/user-attachments/assets/dd84f6e5-7077-4406-8019-29c31383a5e7)

Once the annotation is confirmed and the success message is shown - the selected area with the dependent variable will be highlighted in green.  
Annotated dependent variable should now appear in the output preview on the right hand side.  



### How to select the property annotation region

In order to annotate the property area in the data table:
  1. Select the area by pressing down the left mouse button and holding it while moving in the desired direction.
     Alternatively users can select an area and use the draggable square in the bottom right corner to resize the selection.
  2. Adjust the range of the selected area by changing the column and/or row in the annotation pop-up.
  3. Select property from the "role" dropdown menu.
  4. Confirm the selected area by pressing the "Submit new annotation" button.

![2 3 5_select_property_annotated](https://github.com/user-attachments/assets/5e1fec0e-0bfa-4f8b-8cf8-6e4b2c9ed9e1)

Once the annotation is confirmed and the success message is shown - the selected area with the property will be highlighted in orange.  
Annotated property should now appear in the output preview on the right hand side.  



### How to directly define a property

If the property is not present in the data table, the users can create a custom property:
  1. Select the annotation area that requires a custom property.
  2. Press on the "Add a new property" button in the annotation pop-up, as shown in the image below.

![2 3 6_add_new_property_button_annotated](https://github.com/user-attachments/assets/f3086ab0-d8e9-48eb-bc6e-689175d9ea6f)


  3. In the "Create a new property" pop-up window, enter the property label and description, as shown in the image below.
  4. Press the "Submit new property" button to confirm.

![2 3 6_create_new_property_popup_annotated](https://github.com/user-attachments/assets/c04f9e2c-dfb5-49bb-b9ac-3a39d04abcf8)

Once created, the property will appear in the annotation menu as shown in the image below.  
To change the property label and/or description, press the pencil button and the property pop-up window will come up again.  

![2 3 6_edit_property_button_annotated](https://github.com/user-attachments/assets/9ee7147a-6b00-41b6-81c2-7790b5ce93bd)

Annotated property should now appear in the output preview on the right hand side.  



### How to let the structured ingest tool automatically suggest annotations

Users can choose to let our system automatically suggest annotation blocks.  
Select the "Suggest annotations" option from the project menu, or press the "Suggest annotations" button in the header.  

![2 3 7_suggest_annotations_annotated](https://github.com/user-attachments/assets/29ba7c9f-39f6-4aa8-b243-2f54c5694ad8)


With suggested annotations in place the output preview on the right hand side should be updated to reflect the changes.  
Please note that if you have previously created annotations, this functionality will overwrite those with automatically suggested annotations.  



### How to provide a description for the property

Press the pencil button next to the property in order to change the label and/or description.  
This can be done from either block or cell tab of the annotation pop-up window.  

![2 3 8_edit_property_button_annotated](https://github.com/user-attachments/assets/9e489489-f47a-4388-852c-e4d292303de5)

This will bring up the "Edit property" pop-up window.  
Edit the label and/or description of the property and press "Save changes".  

![2 3 8_edit_property_popup_annotated](https://github.com/user-attachments/assets/faefb6ae-34f6-4b38-8912-fae7081d62d9)

The changes should be automatically reflected in the output window on the right.  



### How to define property tags

Press the "Show property tags" button to bring up the property tags window.  

![2 3 9_show_property_tags_button_annotated](https://github.com/user-attachments/assets/8ecd4d18-93f7-413f-ae9f-ed4df91534ca)

This will bring up the "Property tags" pop-up window.  
In this window users can enter values for DocID, FactorClass, Normalizer, Relevance and Units tags.  
Alternatively, users can create custom tags with the keys and values of their own choosing.  

![2 3 9_property_tags_popup_annotated](https://github.com/user-attachments/assets/3ca6e757-3967-41f0-8b9e-5ac51ff681e9)

Changes are saved automatically and should be reflected in the output preview on the right.  



### How to provide dataset name/description/URL

Users can change the dataset name, description and or data set URL at any time in the "Project Settings" pop-up.  
To bring up the project settings pop-up, select "Project Settings" from the menu in the top-left corner.  

![2 3 10_project_settings_menu_button_annotated](https://github.com/user-attachments/assets/e0414aa6-4f07-4e07-adb6-d50c6e5250df)

The "Project Settings" pop-up is where users can change the dataset name, description and/or data set URL.  
The changes to the project settings are saved automatically.  

![2 3 10_project_settings_annotated](https://github.com/user-attachments/assets/f3ab2694-b36c-4181-ba08-f00705e7c8c1)



### How to upload/download FIDIL json

To upload the FIDIL file, select the "Upload FIDIL" option in the project menu.  
To download the FIDIL file, select the "FIDIL" option from download section of the project menu.  

![2 3 11_fidil_button_annotated](https://github.com/user-attachments/assets/0b62f95f-77ae-43d1-aaf1-c955904e6033)



### How to save/resume an annotation session

Select the "Saved Project" option in order to download and save the ".t2wmlz" project file to disk in order to save your progress.  
To restore the project at a later time, simply upload this ".t2wmlz" file from the main screen.  

![2 3 12_t2wmlz_download_annotated](https://github.com/user-attachments/assets/7f3c8558-edbe-4727-9f2c-60423e7a9ef4)



### How to apply existing annotation to a new structured data file

Select the "Apply Annotations" option fromt he project menu in order to apply existing annotations.  

![2 3 13_apply_annotations_button_annotated](https://github.com/user-attachments/assets/12898b11-e16c-4d10-9d20-d0880b65203d)

This will bring up a pop-up window to upload an existing annotations file.  

![2 3 13_upload_annotations_popup_annotated](https://github.com/user-attachments/assets/a89c31b4-512b-415f-ba8d-9e19a45f3a17)
