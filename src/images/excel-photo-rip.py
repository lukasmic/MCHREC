import pandas as pd

# export https://docs.google.com/spreadsheets/d/1SA1IGUVOi7K0_7AEXC6Kcsu5xQFk5s5ulW3W6YkT4Ao/edit#gid=1030077084 as a csv file

df = pd.read_csv("src/images/yourfile.csv", usecols=[0, 5])

print(df)

df.to_csv("src/images/newfile.csv", index=False)


"""
Make it look like so and dump into Workbench

UPDATE master_cards
SET photo_url = CASE
WHEN master_code = '42014' THEN 'https://hallofheroeshome.files.wordpress.com/2023/10/42014-copy.jpg?strip=info&w=710'
WHEN master_code = '42018' THEN 'https://hallofheroeshome.files.wordpress.com/2023/10/42018.jpg?strip=info&w=710'
    ELSE photo_url
END;


"""