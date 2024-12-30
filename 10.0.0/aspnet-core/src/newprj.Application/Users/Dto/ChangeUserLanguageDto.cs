using System.ComponentModel.DataAnnotations;

namespace newprj.Users.Dto;

public class ChangeUserLanguageDto
{
    [Required]
    public string LanguageName { get; set; }
}