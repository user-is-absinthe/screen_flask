from nltk.translate.bleu_score import sentence_bleu

from flask import redirect
from flask import url_for

import os

# from models import

# attrs_text1 = 'имя = Иванов место = Москва организация = КПСС'
# attrs_text2 = 'имя = Иванов место = Москва организация = КПРФ'
# similarity(attrs_text1,attrs_text2)


def check_answered(any_data):
    if any_data != '':
        return True
    elif any_data is not None:
        return False
    else:
        return False


def get_user_info(current_user_object):
    if not current_user_object.is_authenticated:
        return False, False, False
    else:
        user_id = current_user_object.id_user
        user_name = current_user_object.username
        user_role = current_user_object.user_role
        # user_role = current_user_object.roles[0].name
        return user_id, user_name, user_role
    pass


def check_user_access(current_user, good_roles):
    # true if ok
    # false if need redirect
    if get_user_info(current_user_object=current_user)[2] in list(good_roles):
        return True
    else:
        return False


def save_annotation(path, data):
    with open(path, 'w') as file:
        for l in data:
            file.write(
                l[1] + '-' + l[0] + '\n'
            )
    pass


def similarity(attrs_text1, attrs_text2):  # подсчет похожести по BLEU
    attrs1 = []
    attrs1.append(attrs_text1.split(' '))
    attrs2 = attrs_text2.split(' ')
    score = sentence_bleu(attrs1, attrs2)
    return score


def opener(path, encoding='UTF-8'):
    try:
        with open(path, 'r', encoding=encoding) as file:
            all_text = str()
            lines = file.readlines()
            for l in lines:
                all_text += l
            return all_text.replace('\n', ' ')
    except FileNotFoundError:
        return None
    except TypeError:
        return None
    except Exception as to_out:
        return to_out


def dist_docs(doc_list, user_id_list):
    doc2user = []
    i = 0
    max_i = len(user_id_list)
    for d in doc_list:
        u = user_id_list[i]
        temp = (d, u)
        doc2user.append(temp)
        i = i+1
        if i == max_i:
            i = 0
        u = user_id_list[i]
        temp = (d, u)
        doc2user.append(temp)
    return doc2user


def csv_line_writer(path, data, separator='\t', encode='utf-16'):
    with open(path, 'a', encoding=encode) as csv_file:
        line = ''
        for index_column in range(len(data)):
            line += str(data[index_column])
            if index_column != len(data) - 1:
                line += separator
        line += '\n'
        csv_file.write(line)
    pass


def csv_data_writer(path, data, separator='\t', encode='utf-16'):
    with open(path, 'a', encoding=encode) as csv_file:
        for line in data:
            now_line = ''
            for index_column in range(len(line)):
                now_line += str(line[index_column])
                if index_column != len(line) - 1:
                    now_line += separator
            now_line += '\n'
            csv_file.write(now_line)
    pass


def csv_reader(path, separator, headline=False, encode='utf-16'):
    with open(path, 'r', encoding=encode) as file:
        csv_file = file.readlines()
    csv_file = [this[:-1] for this in csv_file]
    if headline:
        keys_to_dict = csv_file[0].split(separator)
    else:
        keys_to_dict = [i for i in range(0, len(csv_file[0].split(separator)))]

    opened_csv = dict()
    for key in keys_to_dict:
        opened_csv[key] = list()

    for line in csv_file:
        if headline and line == csv_file[0]:
            continue
        separated_line = line.split(separator)
        for index in range(len(keys_to_dict)):
            temp_keys_to_dict = keys_to_dict[index]
            temp_separated_line = separated_line[index]
            opened_csv[temp_keys_to_dict].append(temp_separated_line)

    return opened_csv


def del_file(path):
    try:
        os.remove(path=path)
    except FileNotFoundError:
        pass
    pass


def one_uiml_gen(collect_name, doc_text, doc_title, attributes, path):
    filename = path + doc_title + '_annotation_' + collect_name + '.uiml'
    uiml_txt = '<?xml version="1.0" encoding="utf-16"?>\n<?uimlDocument version="1.0"?>\n'
    uiml_txt = uiml_txt + '<Document>\n <Title Value=\"' + doc_title + '\" />\n'
    uiml_txt = uiml_txt + ' <Text Value=\"' + doc_text + '\" />\n'
    uiml_txt = uiml_txt + ' <DocumentRubrics>\n <Rubric Name=\"' + collect_name + '\">\n'
    for a_name, a_value in attributes.items():
        uiml_txt = uiml_txt + '   <EtalonAttribute Code=\"'+ str(a_name)+ '\" StringValue=\"' + str(a_value) + '\" />\n'
    uiml_txt = uiml_txt + '  </Rubric>\n </DocumentRubrics>\n</Document>'

    with open(filename, mode="w", encoding="utf8") as f:
        f.write(uiml_txt)
    return True


if __name__ == '__main__':
    pass
