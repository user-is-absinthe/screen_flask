from nltk.translate.bleu_score import sentence_bleu

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
        # user_role = current_user_object.user_role
        user_role = current_user_object.roles[0].name
        return user_id, user_name, user_role
    pass


def check_user_access(current_user, good_roles):
    if get_user_info(current_user_object=current_user)[2] in list(good_roles):
        return True
    else:
        return False


def similarity(attrs_text1, attrs_text2):  # подсчет похожести по BLEU
    attrs1 = []
    attrs1.append(attrs_text1.split(' '))
    attrs2 = attrs_text2.split(' ')
    score = sentence_bleu(attrs1, attrs2)
    return score


def opener(path):
    try:
        with open(path, 'r', encoding='UTF-8') as file:
            all_text = str()
            lines = file.readlines()
            for l in lines:
                all_text += l
            return all_text
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
