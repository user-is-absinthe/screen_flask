from nltk.translate.bleu_score import sentence_bleu

# attrs_text1 = 'имя = Иванов место = Москва организация = КПСС'
# attrs_text2 = 'имя = Иванов место = Москва организация = КПРФ'
# similarity(attrs_text1,attrs_text2)


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
